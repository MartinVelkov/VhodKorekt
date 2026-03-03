import React, { useEffect } from "react";
import { Footer } from "@/widgets/layout";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  WalletIcon,
  UserGroupIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";

import styles from "../css/ServiceOne.module.css";

export function ServiceOne() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <header className={styles.hero} aria-labelledby="service-one-title">
        {/* Keep this background image exactly */}
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className={styles.heroInner}>
          <h1
            id="service-one-title"
            className={styles.heroTitle}
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            Професионален домоуправител
          </h1>

          <p
            className={styles.heroSubtitle}
            data-aos="fade-up"
            data-aos-delay="150"
            data-aos-duration="1200"
          >
            Организация, отчетност и поддръжка с ясен процес и постоянен контрол.
          </p>
        </div>
      </header>

      {/* Service Highlights Section */}
      <main className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.grid}>
              <article
                className={styles.card}
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div className={styles.iconBadge} aria-hidden="true">
                  <UserGroupIcon className={styles.icon} />
                </div>
                <h2 className={styles.cardTitle}>Управление и организация</h2>
                <p className={styles.cardText}>
                  Нужен Ви е професионален домоуправител, който знае и най-малките
                  подробности за сградата Ви. Изберете подготвен, обучен,
                  компетентен персонален акаунт мениджър.
                </p>
              </article>

              <article
                className={styles.card}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="150"
              >
                <div className={styles.iconBadge} aria-hidden="true">
                  <WalletIcon className={styles.icon} />
                </div>
                <h2 className={styles.cardTitle}>Бюджет и финанси</h2>
                <p className={styles.cardText}>
                  Нашият финансов отдел е отговорен за плащането на сметките Ви,
                  събирането на месечни вноски, изготвянето на подробните отчети
                  за разходи и приходи.
                </p>
              </article>

              <article
                className={styles.card}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="300"
              >
                <div className={styles.iconBadge} aria-hidden="true">
                  <WrenchScrewdriverIcon className={styles.icon} />
                </div>
                <h2 className={styles.cardTitle}>Техническа поддръжка и ремонти</h2>
                <p className={styles.cardText}>
                  Ежеседмичен преглед на инсталации и общи части. Ние ще съберем
                  оферти и ще осъществим необходимите ремонти. Търсете съдействие
                  24 часа, всеки ден в годината. Работим с реномирани изпълнители
                  в бранша.
                </p>
              </article>

              <article
                className={styles.card}
                data-aos="fade-up"
                data-aos-duration="1200"
                data-aos-delay="450"
              >
                <div className={styles.iconBadge} aria-hidden="true">
                  <AcademicCapIcon className={styles.icon} />
                </div>
                <h2 className={styles.cardTitle}>Юридическа част</h2>
                <p className={styles.cardText}>
                  Юридическият ни екип се състои от опитни медиатори и юристи,
                  които ще разрешат всеки възникнал казус.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footerWrap}>
          <Footer />
        </footer>
      </main>
    </>
  );
}

export default ServiceOne;