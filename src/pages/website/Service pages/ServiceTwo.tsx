import React from "react";
import { FeatureCard } from "@/widgets/cards";
import { featuresData } from "@/data";
import { Footer } from "@/widgets/layout";

import styles from "../css/ServiceTwo.module.css";

export function ServiceTwo() {
  return (
    <main className={styles.page}>
      {/* Hero */}
      <header className={styles.hero} aria-labelledby="service-two-title">
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroInner}>
          <h1 id="service-two-title" className={styles.heroTitle}>
            Услуги
          </h1>

          <p className={styles.heroSubtitle}>
            Ние сме малка компания, която вярва, че персонализираният подход е
            ключът към дългосрочни взаимоотношения. Фокусираме се върху
            иновациите и креативните решения.
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {featuresData.map(({ color, title, icon, photo }) => (
              <div key={title} className={styles.cardWrap}>
                <FeatureCard
                  color={color}
                  title={title}
                  icon={React.createElement(icon, {
                    className: styles.icon,
                  })}
                  photo={photo}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footerWrap}>
        <Footer />
      </footer>
    </main>
  );
}

export default ServiceTwo;