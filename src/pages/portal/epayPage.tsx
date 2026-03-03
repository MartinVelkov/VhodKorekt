import React, { useState } from "react";
import styles from "./css/easypay.module.css";
import Navbar from "./components/navbar";
import { EpayFileGenerator } from "./components/EpayExportPage";
import { ReportsPage } from "./components/ReportsPage";

export const EasyPayPage = () => {
  const [activeTab, setActiveTab] = useState("epayPage");

  const isGenerator = activeTab === "epayPage";
  const genTabId = "tab-generator";
  const repTabId = "tab-report";
  const genPanelId = "panel-generator";
  const repPanelId = "panel-report";

  return (
    <div className={styles.page}>
      <Navbar />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleBlock}>
            <h1 className={styles.h1}>EasyPay / ePay.bg</h1>
            <p className={styles.sub}>
              Изберете изглед и обработете плащанията по структуриран начин.
            </p>
          </div>

          <div className={styles.tabs} role="tablist" aria-label="EasyPay изгледи">
            <button
              id={genTabId}
              role="tab"
              aria-selected={isGenerator}
              aria-controls={genPanelId}
              className={isGenerator ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("epayPage")}
              type="button"
            >
              <span className={styles.tabIcon} aria-hidden="true">📁</span>
              Генератор на файл
            </button>

            <button
              id={repTabId}
              role="tab"
              aria-selected={!isGenerator}
              aria-controls={repPanelId}
              className={!isGenerator ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab("report")}
              type="button"
            >
              <span className={styles.tabIcon} aria-hidden="true">🧾</span>
              Репорт от Оператора
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section
          id={genPanelId}
          role="tabpanel"
          aria-labelledby={genTabId}
          hidden={!isGenerator}
          className={styles.panel}
        >
          <EpayFileGenerator />
        </section>

        <section
          id={repPanelId}
          role="tabpanel"
          aria-labelledby={repTabId}
          hidden={isGenerator}
          className={styles.panel}
        >
          <ReportsPage />
        </section>
      </main>
    </div>
  );
};