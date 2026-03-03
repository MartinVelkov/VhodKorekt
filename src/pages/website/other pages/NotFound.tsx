// src/pages/NotFound.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/widgets/layout";

import styles from "../css/NotFound.module.css";

export function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.inner}>
          <div className={styles.code}>404</div>

          <h1 className={styles.title}>
            Страницата не беше намерена
          </h1>

          <p className={styles.subtitle}>
            Възможно е адресът да е променен или страницата вече да не съществува.
          </p>

          <Link to="/home" className={styles.cta}>
            Към началната страница
          </Link>
        </div>
      </section>

      <footer className={styles.footerWrap}>
        <Footer />
      </footer>
    </main>
  );
}

export default NotFound;