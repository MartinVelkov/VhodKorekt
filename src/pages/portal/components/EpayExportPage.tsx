import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { saveAs } from "file-saver";
import styles from "./css/EpayExportPage.module.css";

// Helper: format EasyPay session timestamp (YYYYMMDDhhmmss)
const getSessionTimestamp = () => {
  const d = new Date();
  const pad2 = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}${pad2(
    d.getHours()
  )}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
};

export function EpayFileGenerator() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [delimiter, setDelimiter] = useState(";");
  const [session, setSession] = useState(getSessionTimestamp());
  const [showInvoices, setShowInvoices] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clients"));
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setClients(data);
      } catch (err) {
        console.error("❌ Error loading clients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const unpaidRows = useMemo(() => {
    return clients.flatMap((c) =>
      (c.paymentHistory || [])
        .filter((p) => p.paid === false && Number(p.remainingAmount) > 0)
        .map((p) => {
          const rem = Number(p.remainingAmount) || 0;
          const intr = 0;
          return {
            anum: c.anum,
            name: c.fullName,
            address: c.address,
            invoiceNo: p.invoiceNo || "",
            phone: c.phone || "",
            amount: (rem + intr).toFixed(2),
            type: "Такса Вход",
          };
        })
    );
  }, [clients]);

  const filePreview = useMemo(() => {
    const header = showInvoices
      ? ["ANUM", "NAME", "ADDRES", "INVOICE", "PHONE", "AMOUNT", "TYPE"].join(delimiter)
      : ["ANUM", "NAME", "ADDRES", "AMOUNT"].join(delimiter);

    const rows = unpaidRows.map((r) =>
      showInvoices
        ? [r.anum, r.name, r.address, r.invoiceNo, r.phone, r.amount, r.type].join(delimiter)
        : [r.anum, r.name, r.address, r.amount].join(delimiter)
    );

    return [header, ...rows, `session=${session}`].join("\n");
  }, [unpaidRows, showInvoices, delimiter, session]);

  const exportFile = (ext = "csv") => {
    const blob = new Blob([filePreview], { type: "text/plain;charset=windows-1251" });
    saveAs(blob, `epay_obligations.${ext}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <h2 className={styles.h2}>Генератор на файл</h2>
          <p className={styles.lead}>
            Генерира файл само с <b>неплатени</b> и <b>ненулеви</b> задължения от колекция <b>clients</b>.
          </p>
        </div>

        <div className={styles.kpis} aria-label="Обобщение">
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Редове</div>
            <div className={styles.kpiValue}>{unpaidRows.length}</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiLabel}>Delimiter</div>
            <div className={styles.kpiValueMono}>{delimiter}</div>
          </div>
        </div>
      </div>

      <div className={styles.controlsCard}>
        <div className={styles.controlsGrid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="delimiter">
              Разделител
            </label>
            <select
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className={styles.select}
            >
              <option value=";">;</option>
              <option value="|">|</option>
              <option value=":">:</option>
            </select>
          </div>

          <div className={styles.fieldInline}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={showInvoices}
                onChange={(e) => setShowInvoices(e.target.checked)}
              />
              <span>Включи фактури (INVOICE, TYPE)</span>
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="session">
              Session
            </label>
            <input
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className={styles.inputMono}
              inputMode="numeric"
              aria-describedby="sessionHelp"
            />
            <div id="sessionHelp" className={styles.help}>
              формат: <span className={styles.mono}>YYYYMMDDhhmmss</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => setSession(getSessionTimestamp())}>
              Обнови сега
            </button>
            <button type="button" className={styles.primary} onClick={() => exportFile("csv")} disabled={loading}>
              Експортирай CSV
            </button>
            <button type="button" className={styles.primary} onClick={() => exportFile("txt")} disabled={loading}>
              Експортирай TXT
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.state}>Зареждане на клиенти…</div>
      ) : (
        <div className={styles.contentGrid}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.h3}>Неплатени задължения</h3>
              <div className={styles.meta}>{unpaidRows.length} записа</div>
            </div>

            <div className={styles.tableWrap} role="region" aria-label="Таблица задължения">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ANUM</th>
                    <th>NAME</th>
                    <th>ADDRESS</th>
                    <th>INVOICE</th>
                    <th className={styles.thNum}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyCell}>
                        ✅ Няма неплатени задължения с положителна сума
                      </td>
                    </tr>
                  ) : (
                    unpaidRows.map((r, i) => (
                      <tr key={i}>
                        <td className={styles.mono}>{r.anum}</td>
                        <td>{r.name || "—"}</td>
                        <td className={styles.addr}>{r.address || "—"}</td>
                        <td className={styles.mono}>{r.invoiceNo || "—"}</td>
                        <td className={`${styles.tdNum} ${styles.mono}`}>{r.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.h3}>Преглед на генерирания файл</h3>
              <div className={styles.meta}>Read-only</div>
            </div>

            <textarea
              value={filePreview}
              readOnly
              className={styles.preview}
              aria-label="Преглед на файла"
              spellCheck={false}
            />
          </section>
        </div>
      )}
    </div>
  );
}