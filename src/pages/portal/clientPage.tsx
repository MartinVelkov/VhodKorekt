import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "@/firebase/firebase";
import Navbar from "@/pages/portal/components/navbar";
import AddressCreatorPopup from "@/pages/portal/components/modal/AddAddressModal";

import styles from "./css/ClientList.module.css";

type PaymentRecord = {
  month?: string; // "YYYY-MM"
  paid?: boolean;
};

type Client = {
  address?: string;
  anum?: string | number;
  frozen?: boolean;
  dueDay?: number;
  paymentHistory?: PaymentRecord[];
};

export function ClientList(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [buildingIds, setBuildingIds] = useState<string[]>([]);

  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [showFrozen, setShowFrozen] = useState<boolean>(false);

  const [month, setMonth] = useState<string>(new Date().toISOString().slice(5, 7));
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  /* ===========================
     SAFE HELPERS (unchanged)
  ============================*/
  function extractCity(address: string) {
    return address?.match(/Гр\.?\s*([^\d,]+)/i)?.[1]?.trim() ?? "Други";
  }

  function extractBlock(address: string) {
    return address?.match(/бл\.\s*\d+/i)?.[0] ?? "Други";
  }

  function stripApartment(address: string) {
    return address?.replace(/,\s*ап\.?\s*\d+|ап\.?\s*\d+/gi, "")?.trim() ?? "";
  }

  function normalizeForMatch(addr = "") {
    if (!addr) return "";
    let a = addr.replace(/[.]/g, " ").replace(/\s+/g, " ").trim();

    a = a
      .replace(/Гр\s+/i, "Гр__")
      .replace(/ул\s+/i, "ул__")
      .replace(/бл\s+/i, "бл__")
      .replace(/вх\s*/i, "вх__")
      .replace(/\s+/g, "_");

    return a;
  }

  function matchBuilding(address: string) {
    if (!address) return null;

    const norm = normalizeForMatch(address);
    const stripped = normalizeForMatch(stripApartment(address));

    if (buildingIds.includes(norm)) return norm;
    if (buildingIds.includes(stripped)) return stripped;

    const prefixHit = buildingIds.find((id) => id.startsWith(stripped));
    if (prefixHit) return prefixHit;

    return null;
  }

  /* ===========================
     LOAD CLIENTS + BUILDINGS
  ============================*/
  useEffect(() => {
    const loadData = async () => {
      try {
        const clSnap = await getDocs(collection(db, "clients"));
        setClients(clSnap.docs.map((doc) => doc.data() as Client));

        const bSnap = await getDocs(collection(db, "buildings"));
        setBuildingIds(bSnap.docs.map((doc) => doc.id));
      } catch (err) {
        console.error("Error loading data:", err);
        alert("Неуспешно зареждане на данни");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedPeriod = `${year}-${month}`;

  /* ===========================
     FILTERING CLIENTS
  ============================*/
  const { filteredClients, paid, unpaid } = useMemo(() => {
    const seenAddresses = new Set<string>();
    let paidLocal = 0;
    let unpaidLocal = 0;

    const filtered = clients.filter((client) => {
      const cityMatch =
        selectedCity === "all" || extractCity(client.address || "") === selectedCity;

      const blockMatch =
        selectedBlock === "all" || extractBlock(client.address || "") === selectedBlock;

      const frozenMatch = showFrozen || !client.frozen;

      if (!cityMatch || !blockMatch || !frozenMatch) return false;

      const strippedAddr = stripApartment(client.address || "");
      if (seenAddresses.has(strippedAddr)) return false;
      seenAddresses.add(strippedAddr);

      const record = client.paymentHistory?.find((p) => p.month === selectedPeriod);
      const isPaid = record?.paid === true;

      const dueDay = Number(client.dueDay || 0);
      const overdue = !isPaid && dueDay > 0 && new Date().getDate() > dueDay;

      const paymentMatch =
        paymentFilter === "all" ||
        (paymentFilter === "paid" && isPaid) ||
        (paymentFilter === "unpaid" && !isPaid);

      if (!paymentMatch) return false;

      if (!client.frozen) {
        if (isPaid) paidLocal++;
        else unpaidLocal++;
      }

      return true;
    });

    return { filteredClients: filtered, paid: paidLocal, unpaid: unpaidLocal };
  }, [clients, selectedCity, selectedBlock, showFrozen, paymentFilter, selectedPeriod]);

  // Options (stable + no duplicate rebuilds in JSX)
  const cityOptions = useMemo(() => {
    const cities = Array.from(new Set(clients.map((c) => extractCity(c.address || ""))));
    return ["all", ...cities];
  }, [clients]);

  const blockOptions = useMemo(() => {
    const blocks = Array.from(
      new Set(
        clients
          .filter((c) => selectedCity === "all" || extractCity(c.address || "") === selectedCity)
          .map((c) => extractBlock(c.address || ""))
      )
    );
    return ["all", ...blocks];
  }, [clients, selectedCity]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loadingCard} role="status" aria-live="polite">
            <div className={styles.loadingTitle}>Зареждане…</div>
            <div className={styles.loadingHint}>Моля изчакайте, подготвяме списъка.</div>
          </div>
        </div>
      </div>
    );
  }

  const totalActive = paid + unpaid;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Списък с клиенти</h1>
            <p className={styles.subtitle}>Филтрирайте по град/блок и следете статуса за периода.</p>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.primaryBtn} onClick={() => setShowPopup(true)} type="button">
              Нов адрес
            </button>
          </div>
        </header>

        {/* FILTERS */}
        <section className={styles.filtersCard} aria-label="Филтри">
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Филтри</legend>

            <div className={styles.filtersGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="city">
                  Град
                </label>
                <select
                  id="city"
                  className={styles.select}
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city === "all" ? "Всички градове" : city}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="block">
                  Блок
                </label>
                <select
                  id="block"
                  className={styles.select}
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                >
                  {blockOptions.map((block) => (
                    <option key={block} value={block}>
                      {block === "all" ? "Всички блокове" : block}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="payment">
                  Плащане
                </label>
                <select
                  id="payment"
                  className={styles.select}
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as "all" | "paid" | "unpaid")}
                >
                  <option value="all">Всички</option>
                  <option value="paid">Платили</option>
                  <option value="unpaid">Неплатили</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="month">
                  Месец
                </label>
                <select
                  id="month"
                  className={styles.select}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="year">
                  Година
                </label>
                <select
                  id="year"
                  className={styles.select}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 3 + i).map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className={styles.fieldInline}>
                <label className={styles.checkboxRow}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={showFrozen}
                    onChange={() => setShowFrozen(!showFrozen)}
                  />
                  <span>Показвай замразени</span>
                </label>
              </div>
            </div>
          </fieldset>
        </section>

        {/* SUMMARY */}
        <section className={styles.summary} aria-label="Обобщение">
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Платили</div>
            <div className={styles.kpiValue}>{paid}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Неплатили</div>
            <div className={styles.kpiValue}>{unpaid}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Общо активни</div>
            <div className={styles.kpiValue}>{totalActive}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Всички показани</div>
            <div className={styles.kpiValue}>{filteredClients.length}</div>
          </div>
        </section>

        {showPopup && <AddressCreatorPopup onClose={() => setShowPopup(false)} />}

        {/* LIST */}
        <section className={styles.list} aria-label="Клиенти">
          {filteredClients.length === 0 ? (
            <div className={styles.emptyCard} role="status" aria-live="polite">
              <h2 className={styles.emptyTitle}>Няма резултати</h2>
              <p className={styles.emptyText}>
                Опитайте с други филтри (град/блок/плащане) или променете периода.
              </p>
            </div>
          ) : (
            filteredClients.map((client) => {
              const stripped = stripApartment(client.address || "");
              const matchedId = matchBuilding(stripped);

              const record = client.paymentHistory?.find((p) => p.month === selectedPeriod);
              const isPaid = record?.paid === true;

              const dueDay = Number(client.dueDay || 0);
              const overdue = !isPaid && dueDay > 0 && new Date().getDate() > dueDay;

              const status: "paid" | "unpaid" | "pending" =
                isPaid ? "paid" : overdue ? "unpaid" : "pending";

              return (
                <article
                  key={String(client.anum ?? stripped)}
                  className={[
                    styles.row,
                    status === "paid" ? styles.rowPaid : "",
                    status === "unpaid" ? styles.rowUnpaid : "",
                    client.frozen ? styles.rowFrozen : "",
                  ].join(" ")}
                >
                  <div className={styles.rowMain}>
                    <div className={styles.rowTop}>
                      {matchedId ? (
                        <Link
                          to={`/portal/address?address=${encodeURIComponent(matchedId)}`}
                          className={styles.addressLink}
                        >
                          {stripped}
                        </Link>
                      ) : (
                        <div className={styles.addressMissing}>
                          <span className={styles.addressText}>{stripped || "(няма адрес)"}</span>
                          <span className={styles.badgeMuted}>Няма сграда</span>
                        </div>
                      )}

                      <span
                        className={[
                          styles.badge,
                          status === "paid"
                            ? styles.badgePaid
                            : status === "unpaid"
                              ? styles.badgeUnpaid
                              : styles.badgePending,
                          client.frozen ? styles.badgeFrozen : "",
                        ].join(" ")}
                        aria-label="Статус"
                      >
                        {client.frozen
                          ? "Замразен"
                          : isPaid
                            ? "Платено"
                            : overdue
                              ? "Просрочено"
                              : "Очакващо"}
                      </span>
                    </div>

                    <div className={styles.meta}>
                      <span>Срок: {dueDay || "—"}</span>
                      <span className={styles.metaDot} aria-hidden="true" />
                      <span>
                        Период: <strong className={styles.strong}>{selectedPeriod}</strong>
                      </span>
                    </div>
                  </div>

                  <div className={styles.rowActions}>
                    <Link
                      className={styles.secondaryBtn}
                      to={`/portal/settings?address=${encodeURIComponent(matchedId ?? "")}`}
                      aria-disabled={!matchedId}
                      onClick={(e) => {
                        if (!matchedId) e.preventDefault();
                      }}
                    >
                      Настройки
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}

export default ClientList;