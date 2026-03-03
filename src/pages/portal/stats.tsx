// src/pages/portal/Statistics.tsx
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Navbar from "@/pages/portal/components/navbar";
import styles from "./css/Statistics.module.css";

type PaymentEntry = {
  date?: string;
  amount?: string | number;
  paid?: boolean;
  type?: string;
  interest?: number | string;
};

type Client = {
  address?: string;
  paymentHistory?: PaymentEntry[];
  buildingId?: string;
  anum?: string | number;
  apartment?: string | number;
  id?: string | number;
};

type Building = {
  id: string;
  address?: string;
  financeData?: {
    settings?: {
      hardTaxes?: Record<
        string,
        {
          amount?: number | string;
          mode?: "perBuilding" | "perApartment" | string;
        }
      >;
    };
  };
  settings?: {
    hardTaxes?: Record<
      string,
      {
        amount?: number | string;
        mode?: "perBuilding" | "perApartment" | string;
      }
    >;
  };
};

type BuildingsState = {
  byId: Record<string, Building>;
  byNorm: Record<string, Building>;
};

type StatsState = {
  total: number;
  totalPaidEntries: number;
  totalUnpaidEntries: number;
  paidPercent: number;
  paidMoney: number;
  totalMoney: number;
  domPaidEntries: number;
  domUnpaidEntries: number;
  domPaidMoney: number;
  domTotalMoney: number;
  interestAccrued: number;
  interestCollected: number;
  interestUncollected: number;
};

type TimelineBucket = {
  dateSortKey: string; // ISO date used only for sorting
  label: string; // what we show on x-axis
  paidAmount: number;
  unpaidAmount: number;
  paidCount: number;
  unpaidCount: number;
  interestAccrued: number;
  interestCollected: number;
  domPaidMoney: number;
  domUnpaidMoney: number;
};

type TimelineState = {
  categories: string[];
  paidAmounts: number[];
  unpaidAmounts: number[];
  paidCounts: number[];
  unpaidCounts: number[];
  interestAccrued: number[];
  interestCollected: number[];
  domPaidMoney: number[];
  domUnpaidMoney: number[];
};

export function Statistics(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [buildings, setBuildings] = useState<BuildingsState>({ byId: {}, byNorm: {} });

  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("month");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");

  const [stats, setStats] = useState<StatsState>({
    total: 0,
    totalPaidEntries: 0,
    totalUnpaidEntries: 0,
    paidPercent: 0,
    paidMoney: 0,
    totalMoney: 0,
    domPaidEntries: 0,
    domUnpaidEntries: 0,
    domPaidMoney: 0,
    domTotalMoney: 0,
    interestAccrued: 0,
    interestCollected: 0,
    interestUncollected: 0,
  });

  const [timeline, setTimeline] = useState<TimelineState>({
    categories: [],
    paidAmounts: [],
    unpaidAmounts: [],
    paidCounts: [],
    unpaidCounts: [],
    interestAccrued: [],
    interestCollected: [],
    domPaidMoney: [],
    domUnpaidMoney: [],
  });

  // Strip apartment like "ап. 3" from string address
  const normalizeAddress = (addr: string | undefined) =>
    (addr || "").replace(/ап\.\s*\d+/gi, "").trim();

  function getClientBuildingKey(client: Client): string | null {
    const byId = buildings.byId || {};
    const byNorm = buildings.byNorm || {};

    if (client.buildingId && byId[client.buildingId]) return client.buildingId;

    const norm = normalizeAddress(client.address);
    const found = byNorm[norm];
    if (found) return found.id;

    return null;
  }

  function buildingToClientDate(buildingDate: string): string {
    if (!buildingDate || typeof buildingDate !== "string") return "";
    const parts = buildingDate.split("/");
    if (parts.length !== 3) return buildingDate;
    const [m, _day, y] = parts;
    const mm = String(m).padStart(2, "0");
    return `${y}-${mm}-01`;
  }

  function normalizeDate(dateString?: string): string {
    if (!dateString) return "";
    if (dateString.includes("/")) return buildingToClientDate(dateString);
    return dateString;
  }

  function getPerApartmentDomFeeForClient(client: Client): number | null {
    const bKey = getClientBuildingKey(client);
    if (!bKey) return null;

    const building = buildings.byId[bKey];
    if (!building) return null;

    const hardTaxes =
      building.financeData?.settings?.hardTaxes ||
      building.settings?.hardTaxes ||
      {};

    const domCfg = hardTaxes["Такса домоуправител"];
    if (!domCfg) return null;

    const amount = Number(domCfg.amount) || 0;
    if (!amount) return null;

    const mode = domCfg.mode || "perBuilding";

    const aptSet = new Set<string>();
    clients.forEach((c) => {
      const key = getClientBuildingKey(c);
      if (key !== bKey) return;
      const aptId = String(c.anum ?? c.apartment ?? c.id ?? "").trim();
      if (!aptId) return;
      aptSet.add(aptId);
    });

    const aptCount = aptSet.size || 1;

    if (mode === "perApartment") return amount;
    return amount / aptCount;
  }

  const getDateLimit = (range: typeof timeRange): Date | null => {
    const now = new Date();
    switch (range) {
      case "day":
        return new Date(now.setHours(0, 0, 0, 0));
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "year":
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const pad2 = (n: number) => String(n).padStart(2, "0");

  function toISODate(d: Date): string {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  // Monday-start week bucket
  function getWeekStartISO(d: Date): string {
    const dd = new Date(d);
    const day = dd.getDay(); // 0 Sun, 1 Mon...
    const diff = (day === 0 ? -6 : 1) - day; // move to Monday
    dd.setDate(dd.getDate() + diff);
    dd.setHours(0, 0, 0, 0);
    return toISODate(dd);
  }

  function bucketFor(dateISO: string, range: typeof timeRange): { sortKey: string; label: string } {
    const d = new Date(dateISO);
    if (Number.isNaN(d.getTime())) return { sortKey: "", label: "" };

    if (range === "day") {
      const dayISO = toISODate(d);
      return { sortKey: dayISO, label: dayISO };
    }

    if (range === "week") {
      const weekStart = getWeekStartISO(d);
      return { sortKey: weekStart, label: `Седм. от ${weekStart}` };
    }

    if (range === "month") {
      const y = d.getFullYear();
      const m = pad2(d.getMonth() + 1);
      const sortKey = `${y}-${m}-01`;
      return { sortKey, label: `${y}-${m}` };
    }

    // year
    const y = d.getFullYear();
    return { sortKey: `${y}-01-01`, label: String(y) };
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const [clientsSnap, buildingsSnap] = await Promise.all([
          getDocs(collection(db, "clients")),
          getDocs(collection(db, "buildings")),
        ]);

        const clientsData = clientsSnap.docs.map((doc) => doc.data() as Client);
        setClients(clientsData);

        const byId: Record<string, Building> = {};
        const byNorm: Record<string, Building> = {};

        buildingsSnap.docs.forEach((docSnap) => {
          const data = docSnap.data() as Omit<Building, "id">;
          const id = docSnap.id;
          const addr = data.address || "";
          const norm = normalizeAddress(addr);

          const full: Building = { id, ...data };
          byId[id] = full;
          if (norm) byNorm[norm] = full;
        });

        setBuildings({ byId, byNorm });
      } catch (err) {
        console.error("Error loading clients/buildings for statistics:", err);
        setLoadError("Неуспешно зареждане на данни. Опитайте отново.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueAddresses = useMemo(
    () => [...new Set(clients.map((c) => normalizeAddress(c.address)))].filter(Boolean),
    [clients]
  );

  const uniqueYears = useMemo(() => {
    const years = [
      ...new Set(
        clients.flatMap((c) => (c.paymentHistory || []).map((e) => e.date?.slice(0, 4)))
      ),
    ]
      .filter(Boolean)
      .sort()
      .reverse();
    return years as string[];
  }, [clients]);

  const uniqueMonths = useMemo(() => {
    const months = [
      ...new Set(
        clients.flatMap((c) => (c.paymentHistory || []).map((e) => e.date?.slice(5, 7)))
      ),
    ]
      .filter(Boolean)
      .sort();
    return months as string[];
  }, [clients]);

  useEffect(() => {
    if (timeRange !== "month") setSelectedMonth("");
  }, [timeRange]);

  // Calculate stats + timeline series
  useEffect(() => {
    if (clients.length === 0) {
      setStats((s) => ({
        ...s,
        total: 0,
        totalPaidEntries: 0,
        totalUnpaidEntries: 0,
        paidPercent: 0,
        paidMoney: 0,
        totalMoney: 0,
        domPaidEntries: 0,
        domUnpaidEntries: 0,
        domPaidMoney: 0,
        domTotalMoney: 0,
        interestAccrued: 0,
        interestCollected: 0,
        interestUncollected: 0,
      }));
      setTimeline({
        categories: [],
        paidAmounts: [],
        unpaidAmounts: [],
        paidCounts: [],
        unpaidCounts: [],
        interestAccrued: [],
        interestCollected: [],
        domPaidMoney: [],
        domUnpaidMoney: [],
      });
      return;
    }

    const dateLimit = getDateLimit(timeRange);

    let filteredClients = clients;

    if (selectedAddress) {
      filteredClients = filteredClients.filter(
        (c) => normalizeAddress(c.address) === selectedAddress
      );
    }

    filteredClients = filteredClients.map((c) => ({
      ...c,
      paymentHistory: (c.paymentHistory || []).filter((e) => {
        const date = normalizeDate(e.date);
        if (!date) return false;

        if (selectedYear && !date.startsWith(selectedYear)) return false;

        if (timeRange === "month" && selectedMonth) {
          if (date.slice(5, 7) !== selectedMonth) return false;
        }

        return true;
      }),
    }));

    let total = filteredClients.length;
    let totalPaidEntries = 0;
    let totalUnpaidEntries = 0;
    let paidMoney = 0;
    let totalMoney = 0;

    let domPaidEntries = 0;
    let domUnpaidEntries = 0;
    let domPaidMoney = 0;
    let domTotalMoney = 0;

    let totalInterestAccrued = 0;
    let totalInterestCollected = 0;

    const buckets = new Map<string, TimelineBucket>();

    const ensureBucket = (sortKey: string, label: string) => {
      if (!sortKey) return null;
      const existing = buckets.get(sortKey);
      if (existing) return existing;

      const b: TimelineBucket = {
        dateSortKey: sortKey,
        label,
        paidAmount: 0,
        unpaidAmount: 0,
        paidCount: 0,
        unpaidCount: 0,
        interestAccrued: 0,
        interestCollected: 0,
        domPaidMoney: 0,
        domUnpaidMoney: 0,
      };
      buckets.set(sortKey, b);
      return b;
    };

    filteredClients.forEach((client) => {
      const history = client.paymentHistory || [];
      if (!history.length) return;

      const perAptDomFee = getPerApartmentDomFeeForClient(client);

      history.forEach((entry) => {
        const entryDateStr = normalizeDate(entry.date);
        if (!entryDateStr) return;

        const entryDate = new Date(entryDateStr);
        if (Number.isNaN(entryDate.getTime())) return;
        if (dateLimit && entryDate < dateLimit) return;

        const amount = parseFloat(String(entry.amount ?? 0)) || 0;
        const isPaid = !!entry.paid;

        // bucket
        const { sortKey, label } = bucketFor(entryDateStr, timeRange);
        const b = ensureBucket(sortKey, label);
        if (!b) return;

        // interest
        const interest = Number(entry.interest || 0);
        if (interest > 0) {
          totalInterestAccrued += interest;
          b.interestAccrued += interest;
          if (isPaid) {
            totalInterestCollected += interest;
            b.interestCollected += interest;
          }
        }

        // money + entries
        totalMoney += amount;
        if (isPaid) {
          totalPaidEntries++;
          paidMoney += amount;

          b.paidCount += 1;
          b.paidAmount += amount;
        } else {
          totalUnpaidEntries++;
          b.unpaidCount += 1;
          b.unpaidAmount += amount;
        }

        // dom fee (non-repair)
        if (entry.type !== "repair" && perAptDomFee != null) {
          const domAmount = perAptDomFee;
          domTotalMoney += domAmount;

          if (isPaid) {
            domPaidEntries++;
            domPaidMoney += domAmount;
            b.domPaidMoney += domAmount;
          } else {
            domUnpaidEntries++;
            b.domUnpaidMoney += domAmount;
          }
        }
      });
    });

    const paidPercent = totalMoney === 0 ? 0 : Math.round((paidMoney / totalMoney) * 100);
    const totalInterestUncollected = totalInterestAccrued - totalInterestCollected;

    setStats({
      total,
      totalPaidEntries,
      totalUnpaidEntries,
      paidPercent,
      paidMoney,
      totalMoney,
      domPaidEntries,
      domUnpaidEntries,
      domPaidMoney,
      domTotalMoney,
      interestAccrued: totalInterestAccrued,
      interestCollected: totalInterestCollected,
      interestUncollected: totalInterestUncollected,
    });

    const sorted = [...buckets.values()].sort((a, b) =>
      a.dateSortKey.localeCompare(b.dateSortKey)
    );

    setTimeline({
      categories: sorted.map((x) => x.label),
      paidAmounts: sorted.map((x) => Number(x.paidAmount.toFixed(2))),
      unpaidAmounts: sorted.map((x) => Number(x.unpaidAmount.toFixed(2))),
      paidCounts: sorted.map((x) => x.paidCount),
      unpaidCounts: sorted.map((x) => x.unpaidCount),
      interestAccrued: sorted.map((x) => Number(x.interestAccrued.toFixed(2))),
      interestCollected: sorted.map((x) => Number(x.interestCollected.toFixed(2))),
      domPaidMoney: sorted.map((x) => Number(x.domPaidMoney.toFixed(2))),
      domUnpaidMoney: sorted.map((x) => Number(x.domUnpaidMoney.toFixed(2))),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, buildings, timeRange, selectedAddress, selectedYear, selectedMonth]);

  const hasResults = stats.total > 0;

  // ---------- Apex configs ----------

  // Donut: paid/unpaid entries
  const donutSeries = useMemo(
    () => [stats.totalPaidEntries, stats.totalUnpaidEntries],
    [stats.totalPaidEntries, stats.totalUnpaidEntries]
  );

  const donutOptions: ApexOptions = useMemo(
    () => ({
      chart: { type: "donut", toolbar: { show: false } },
      labels: ["Платени", "Неплатени"],
      legend: { position: "bottom" },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Събираемост",
                formatter: () => `${stats.paidPercent}%`,
              },
            },
          },
        },
      },
      tooltip: {
        y: { formatter: (val: number) => `${val} бр.` },
      },
    }),
    [stats.paidPercent]
  );

  // Total bar: total vs paid money
  const totalBarSeries = useMemo(
    () => [
      { name: "Сума (€)", data: [Number(stats.totalMoney.toFixed(2)), Number(stats.paidMoney.toFixed(2))] },
    ],
    [stats.totalMoney, stats.paidMoney]
  );

  const totalBarOptions: ApexOptions = useMemo(
    () => ({
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 8, columnWidth: "55%" } },
      dataLabels: { enabled: false },
      xaxis: { categories: ["Общо дължими", "Събрани"] },
      tooltip: { y: { formatter: (v: number) => `${v.toFixed(2)} €` } },
    }),
    []
  );

  // Timeline: Paid vs Unpaid amounts (stacked)
  const amountsSeries = useMemo(
    () => [
      { name: "Платени (€)", data: timeline.paidAmounts },
      { name: "Неплатени (€)", data: timeline.unpaidAmounts },
    ],
    [timeline.paidAmounts, timeline.unpaidAmounts]
  );

  const amountsOptions: ApexOptions = useMemo(
    () => ({
      chart: { type: "bar", stacked: true, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 6, columnWidth: "65%" } },
      dataLabels: { enabled: false },
      xaxis: { categories: timeline.categories, labels: { rotate: -30 } },
      tooltip: { y: { formatter: (v: number) => `${v.toFixed(2)} €` } },
    }),
    [timeline.categories]
  );

  // Timeline: Paid vs Unpaid entry counts (lines)
  const countsSeries = useMemo(
    () => [
      { name: "Платени (бр.)", data: timeline.paidCounts },
      { name: "Неплатени (бр.)", data: timeline.unpaidCounts },
    ],
    [timeline.paidCounts, timeline.unpaidCounts]
  );

  const countsOptions: ApexOptions = useMemo(
    () => ({
      chart: { type: "line", toolbar: { show: false } },
      stroke: { width: 3, curve: "smooth" },
      dataLabels: { enabled: false },
      xaxis: { categories: timeline.categories, labels: { rotate: -30 } },
      tooltip: { y: { formatter: (v: number) => `${v} бр.` } },
    }),
    [timeline.categories]
  );

  // Timeline: Interest accrued vs collected (lines)
  const interestSeries = useMemo(
    () => [
      { name: "Начислена лихва (€)", data: timeline.interestAccrued },
      { name: "Събрана лихва (€)", data: timeline.interestCollected },
    ],
    [timeline.interestAccrued, timeline.interestCollected]
  );

  const interestOptions: ApexOptions = useMemo(
    () => ({
      chart: { type: "line", toolbar: { show: false } },
      stroke: { width: 3, curve: "smooth" },
      dataLabels: { enabled: false },
      xaxis: { categories: timeline.categories, labels: { rotate: -30 } },
      tooltip: { y: { formatter: (v: number) => `${v.toFixed(2)} €` } },
    }),
    [timeline.categories]
  );

  // Timeline: Dom fee paid vs unpaid (stacked)
  const domSeries = useMemo(
    () => [
      { name: "Такса платена (€)", data: timeline.domPaidMoney },
      { name: "Такса неплатена (€)", data: timeline.domUnpaidMoney },
    ],
    [timeline.domPaidMoney, timeline.domUnpaidMoney]
  );

  const domOptions: ApexOptions = useMemo(
    () => ({
      chart: { type: "bar", stacked: true, toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 6, columnWidth: "65%" } },
      dataLabels: { enabled: false },
      xaxis: { categories: timeline.categories, labels: { rotate: -30 } },
      tooltip: { y: { formatter: (v: number) => `${v.toFixed(2)} €` } },
    }),
    [timeline.categories]
  );

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Статистика</h1>
            <p className={styles.subtitle}>
              Филтрирайте по период, адрес и година. Графиките се обновяват автоматично.
            </p>
          </div>
        </header>

        {/* Filters */}
        <section className={styles.filtersCard} aria-label="Филтри">
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Филтри</legend>

            <div className={styles.filtersGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="timeRange">
                  Период
                </label>
                <select
                  id="timeRange"
                  className={styles.select}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                >
                  <option value="day">Дневно</option>
                  <option value="week">Седмично</option>
                  <option value="month">Месечно</option>
                  <option value="year">Годишно</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="address">
                  Адрес
                </label>
                <select
                  id="address"
                  className={styles.select}
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  <option value="">Всички</option>
                  {uniqueAddresses.map((addr) => (
                    <option key={addr} value={addr}>
                      {addr}
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
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Всички</option>
                  {uniqueYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {timeRange === "month" && (
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="month">
                    Месец
                  </label>
                  <select
                    id="month"
                    className={styles.select}
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option value="">Всички</option>
                    {uniqueMonths.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className={styles.filtersMeta} aria-live="polite">
              {isLoading ? (
                <span className={styles.muted}>Зареждане…</span>
              ) : loadError ? (
                <span className={styles.error}>{loadError}</span>
              ) : (
                <span className={styles.muted}>
                  Резултати: <strong className={styles.strong}>{stats.total}</strong> клиента
                </span>
              )}
            </div>
          </fieldset>
        </section>

        {/* Empty / No results */}
        {!isLoading && !loadError && !hasResults && (
          <section className={styles.empty} aria-label="Няма резултати">
            <div className={styles.emptyCard}>
              <h2 className={styles.emptyTitle}>Няма данни за избраните филтри</h2>
              <p className={styles.emptyText}>
                Опитайте с друг период, адрес или година. Ако очаквате данни, проверете дали има
                добавена история на плащания.
              </p>
            </div>
          </section>
        )}

        {/* Stats sections */}
        {hasResults && (
          <section className={styles.gridSections} aria-label="Статистики">
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Основна статистика</h2>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Общо клиенти</div>
                  <div className={styles.statValue}>{stats.total}</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Платени вноски</div>
                  <div className={styles.statValue}>{stats.totalPaidEntries}</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Неплатени вноски</div>
                  <div className={styles.statValue}>{stats.totalUnpaidEntries}</div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Събираемост</div>
                  <div className={styles.statValue}>{stats.paidPercent}%</div>
                </div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Финансова статистика</h2>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Събрани пари</div>
                  <div className={styles.statValue}>
                    {stats.paidMoney.toFixed(2)} <span className={styles.unit}>€</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Общо дължими</div>
                  <div className={styles.statValue}>
                    {stats.totalMoney.toFixed(2)} <span className={styles.unit}>€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Такса домоуправител</h2>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Платени</div>
                  <div className={styles.statValue}>
                    {stats.domPaidEntries} <span className={styles.unit}>бр.</span>
                  </div>
                  <div className={styles.statSubValue}>
                    {stats.domPaidMoney.toFixed(2)} <span className={styles.unit}>€</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Неплатени</div>
                  <div className={styles.statValue}>
                    {stats.domUnpaidEntries} <span className={styles.unit}>бр.</span>
                  </div>
                  <div className={styles.statSubValue}>
                    {(stats.domTotalMoney - stats.domPaidMoney).toFixed(2)}{" "}
                    <span className={styles.unit}>€</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Charts */}
        {hasResults && (
          <section className={styles.sectionCard} aria-label="Графики">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Графики</h2>
              <p className={styles.sectionHint}>Визуализация на плащания, събираемост, лихви и такси.</p>
            </div>

            <div className={styles.chartsGrid}>
              {/* Donut */}
              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Разпределение (вноски)</div>
                <div className={styles.chartCanvasWrap}>
                  <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={300} />
                </div>
              </div>

              {/* Total bar */}
              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Финансова събираемост (общо)</div>
                <div className={styles.chartCanvasWrap}>
                  <ReactApexChart options={totalBarOptions} series={totalBarSeries} type="bar" height={300} />
                </div>
              </div>

              {/* Timeline amounts */}
              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Платени vs Неплатени суми по период</div>
                <div className={styles.chartCanvasWrap}>
                  <ReactApexChart options={amountsOptions} series={amountsSeries} type="bar" height={320} />
                </div>
              </div>

              {/* Timeline counts */}
              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Платени vs Неплатени вноски (бр.) по период</div>
                <div className={styles.chartCanvasWrap}>
                  <ReactApexChart options={countsOptions} series={countsSeries} type="line" height={320} />
                </div>
              </div>

              {/* Interest */}
              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Лихви: начислена vs събрана по период</div>
                <div className={styles.chartCanvasWrap}>
                  <ReactApexChart options={interestOptions} series={interestSeries} type="line" height={320} />
                </div>
              </div>

              {/* Dom fee */}
              <div className={styles.chartCard}>
                <div className={styles.chartTitle}>Такса домоуправител: платена vs неплатена по период</div>
                <div className={styles.chartCanvasWrap}>
                  <ReactApexChart options={domOptions} series={domSeries} type="bar" height={320} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}