import React, { useMemo, useState } from "react";
import { collection, getDoc, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/firebase";

import styles from "./css/ReportsPage.module.css";

type MatchedClient = {
  abonat: string;
  invoice: string;
  datetime: string;
  formattedDate: string;
  amount: number;
  ref: string;
  source: string;
  sourceType: string;
  clientFound: boolean;
  clientId?: string;
  clientName: string;
  address: string;
  paymentHistory?: any[];
  isPaid?: boolean;
  amountMatches?: boolean;
};

export function ReportsPage() {
  const [rawInput, setRawInput] = useState(`202779050:202:20261109151215:430.25:449297449297:700020
131503520:205:20261109164216:155.67:523619523619:700021
131503523:210:20261109164216:170.01:523617523617:700011
131503520:205:20261109164216:155.67:523619523619:700001
131503523:210:20261109164216:170.01:523617523617:700002
131503523:210:20151109164216:170.01:523617523617:21`);

  const [records, setRecords] = useState<any[]>([]);
  const [sessionInfo, setSessionInfo] = useState<{ session: string; count: number; total: string } | null>(null);
  const [matchedClients, setMatchedClients] = useState<MatchedClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingAll, setUpdatingAll] = useState(false);

  // 🔹 Determine payment type
  const getSourceType = (src: string) => {
    if (src.startsWith("700020") || src.startsWith("700021")) return "easypay";
    if (src.startsWith("700011")) return "epay";
    if (src.startsWith("700001")) return "cash";
    if (src.startsWith("700002")) return "bank";
    return "unknown";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      easypay: "EasyPay (каса)",
      epay: "ePay.bg (онлайн)",
      cash: "Каса",
      bank: "Банков превод",
      unknown: "Неизвестен",
    };
    return labels[type] || labels.unknown;
  };

  // 🔹 Format datetime
  const formatDateTime = (dt: string) => {
    if (!dt || dt.length < 14) return dt;
    return `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)} ${dt.slice(8, 10)}:${dt.slice(10, 12)}:${dt.slice(12, 14)}`;
  };

  // Derived: quick stats
  const stats = useMemo(() => {
    const total = matchedClients.reduce((s, r) => s + (r.amount || 0), 0);
    const paid = matchedClients.filter((r) => r.clientFound && r.isPaid).length;
    const unpaid = matchedClients.filter((r) => r.clientFound && !r.isPaid).length;
    const notFound = matchedClients.filter((r) => !r.clientFound).length;
    return {
      total: total.toFixed(2),
      paid,
      unpaid,
      notFound,
      count: matchedClients.length,
    };
  }, [matchedClients]);

  // 🔹 Parse input
  const parseInput = async () => {
    const lines = rawInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("session"));

    const parsed = lines
      .map((line) => {
        const [abonat, invoice, datetime, amount, ref, source] = line.split(":");
        if (!abonat || !invoice || !datetime || !amount || !ref || !source) return null;
        return {
          abonat,
          invoice,
          datetime,
          formattedDate: formatDateTime(datetime),
          amount: parseFloat(amount),
          ref,
          source,
          sourceType: getSourceType(source),
        };
      })
      .filter(Boolean);

    setRecords(parsed as any[]);

    const total = (parsed as any[]).reduce((sum, r) => sum + (r.amount || 0), 0).toFixed(2);
    const session = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    setSessionInfo({ session, count: parsed.length, total });

    await matchClientsInFirestore(parsed as any[]);
  };

  // 🔹 Match abonats with clients and their invoices
  const matchClientsInFirestore = async (reportRecords: any[]) => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "clients"));
      const clients = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

      const matches: MatchedClient[] = reportRecords.map((r) => {
        const found = clients.find((c) => String(c.anum) === String(r.abonat));
        if (!found) {
          return {
            ...r,
            clientFound: false,
            clientName: "❌ Не е открит",
            address: "",
            paymentMatch: false,
            isPaid: false,
            amountMatches: false,
          };
        }

        const payment = found.paymentHistory?.find((p: any) => String(p.invoiceNo) === String(r.invoice));
        const isPaid = payment?.paid === true;
        const amountMatches = payment && Math.abs(payment.amount - r.amount) < 0.01;

        return {
          ...r,
          clientFound: true,
          clientId: found.id,
          clientName: found.users?.[0]?.fullName || "(няма име)",
          address: found.address || "",
          paymentHistory: found.paymentHistory || [],
          isPaid,
          amountMatches,
        };
      });

      setMatchedClients(matches);
    } catch (err) {
      console.error("❌ Грешка при зареждане на клиенти:", err);
      alert("Неуспешно зареждане на клиенти от базата данни.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update all unpaid payments in Firestore
  const markAllAsPaid = async () => {
    const unpaid = matchedClients.filter((c) => !c.isPaid && c.clientFound);

    if (unpaid.length === 0) {
      alert("✅ Всички записи вече са маркирани като платени.");
      return;
    }

    if (!window.confirm(`Сигурни ли сте, че искате да маркирате ${unpaid.length} плащания като платени?`)) {
      return;
    }

    setUpdatingAll(true);

    try {
      for (const entry of unpaid) {
        const clientRef = doc(db, "clients", entry.clientId!);
        const clientSnap = await getDoc(clientRef);
        if (!clientSnap.exists()) continue;

        const clientData: any = clientSnap.data();
        const paymentHistory = clientData.paymentHistory || [];

        let incomeToAdd = 0;

        const updatedHistory = paymentHistory.map((p: any) => {
          if (String(p.invoiceNo) === String(entry.invoice) && p.paid !== true) {
            incomeToAdd += entry.amount;
            return {
              ...p,
              paid: true,
              paidAmount: entry.amount,
              remainingAmount: 0,
              paidAt: new Date().toISOString(),
            };
          }
          return p;
        });

        // 1️⃣ Update client
        await updateDoc(clientRef, {
          paymentHistory: updatedHistory,
          updatedAt: new Date().toISOString(),
        });

        // 2️⃣ Update building income
        if (clientData.buildingId && incomeToAdd > 0) {
          const buildingIdSafe = String(clientData.buildingId).replace(/\//g, "|");
          const buildingRef = doc(db, "buildings", buildingIdSafe);

          const incomeDate = entry.datetime.slice(0, 4) + "-" + entry.datetime.slice(4, 6) + "-01";

          await updateDoc(buildingRef, {
            [`income.${incomeDate}`]: increment(incomeToAdd),
            updatedAt: new Date(),
          });
        }
      }

      // ✅ Update UI
      setMatchedClients((prev) =>
        prev.map((c) => (!c.isPaid && c.clientFound ? { ...c, isPaid: true } : c))
      );

      alert(`✅ ${unpaid.length} плащания бяха успешно обработени.`);
    } catch (err) {
      console.error("❌ Грешка при обновяване:", err);
      alert("Грешка при маркиране на плащанията.");
    } finally {
      setUpdatingAll(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Top header */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Репорт от плащания</h2>
          <p className={styles.subtitle}>
            Поставете данните от оператора, анализирайте и маркирайте коректно платените фактури.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={parseInput}
            disabled={loading || updatingAll}
          >
            {loading ? "Зареждане…" : "Анализирай репорта"}
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={markAllAsPaid}
            disabled={updatingAll || loading || matchedClients.length === 0}
          >
            {updatingAll ? "Обновяване…" : "Маркирай всички като платени"}
          </button>
        </div>
      </header>

      {/* Input */}
      <section className={styles.card} aria-label="Входни данни">
        <div className={styles.cardHead}>
          <div className={styles.cardTitle}>Вход</div>
          <div className={styles.cardHint}>Формат: abonat:invoice:datetime:amount:reference:source</div>
        </div>

        <textarea
          className={styles.textarea}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="abonat:invoice:datetime:amount:reference:source"
          spellCheck={false}
        />

        {sessionInfo ? (
          <div className={styles.sessionBar} role="status" aria-live="polite">
            <span className={styles.sessionChip}>Сесия: {sessionInfo.session}</span>
            <span className={styles.sessionChip}>Редове: {sessionInfo.count}</span>
            <span className={styles.sessionChip}>Общо: {sessionInfo.total} €</span>
          </div>
        ) : (
          <div className={styles.helper}>
            Съвет: Премахнете празни редове. Редове със “session…” се игнорират автоматично.
          </div>
        )}
      </section>

      {/* Results */}
      <section className={styles.results}>
        <div className={styles.resultsHead}>
          <h3 className={styles.sectionTitle}>Съвпадения</h3>

          {matchedClients.length > 0 ? (
            <div className={styles.metrics} aria-label="Статистика">
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Общо</div>
                <div className={styles.metricValue}>{stats.count}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Платени</div>
                <div className={styles.metricValue}>{stats.paid}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Неплатени</div>
                <div className={styles.metricValue}>{stats.unpaid}</div>
              </div>
              <div className={styles.metric}>
                <div className={styles.metricLabel}>Неоткрити</div>
                <div className={styles.metricValue}>{stats.notFound}</div>
              </div>
              <div className={styles.metricWide}>
                <div className={styles.metricLabel}>Сума</div>
                <div className={styles.metricValue}>{stats.total} €</div>
              </div>
            </div>
          ) : null}
        </div>

        {matchedClients.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Няма резултати</div>
            <div className={styles.emptyText}>Поставете данни и натиснете “Анализирай репорта”.</div>
          </div>
        ) : (
          <div className={styles.tableWrap} role="region" aria-label="Таблица резултати" tabIndex={0}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Абонатен №</th>
                  <th>Фактура №</th>
                  <th>Клиент</th>
                  <th>Адрес</th>
                  <th>Дата и час</th>
                  <th className={styles.thRight}>Сума</th>
                  <th>Тип плащане</th>
                  <th>Източник</th>
                  <th className={styles.thCenter}>Статус</th>
                </tr>
              </thead>

              <tbody>
                {matchedClients.map((r, i) => {
                  const rowTone =
                    !r.clientFound ? styles.rowMissing : r.isPaid ? styles.rowPaid : styles.rowUnpaid;

                  return (
                    <tr key={i} className={rowTone}>
                      <td className={styles.mono}>{r.abonat}</td>
                      <td className={styles.mono}>{r.invoice}</td>
                      <td>{r.clientName}</td>
                      <td className={styles.addressCell}>{r.address || "—"}</td>
                      <td>
                        <div className={styles.dateCell}>
                          <span>{r.formattedDate}</span>
                          <span className={styles.dateRaw}>({r.datetime})</span>
                        </div>
                      </td>

                      <td className={styles.tdRight}>
                        <span className={r.amountMatches ? styles.amountOk : styles.amountBad}>
                          {r.amount.toFixed(2)} €
                        </span>
                      </td>

                      <td>
                        <span className={styles.typePill} data-type={r.sourceType}>
                          {getTypeLabel(r.sourceType)}
                        </span>
                      </td>

                      <td className={styles.monoMuted}>{r.source}</td>

                      <td className={styles.tdCenter}>
                        {r.isPaid ? (
                          <span className={styles.pillOk}>Платено</span>
                        ) : (
                          <span className={styles.pillBad}>Неплатено</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}