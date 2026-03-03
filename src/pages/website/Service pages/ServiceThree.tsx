import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "@/widgets/layout";

import styles from "../css/ServiceThree.module.css";

type Service = {
  title: string;
  description: string;
  buttonText: string;
};

const services: Service[] = [
  {
    title: "Почистване",
    description:
      "Вход Корект предлага за своите клиенти услуги по специализирано почистване на жилищни сгради и комплекси от затворен тип. Дружеството разполага с квалифициран и обучен екип от хигиенисти, специализирана почистваща техника и вътрешна система за контрол на качеството.",
    buttonText: "Потърсете ни сега",
  },
  {
    title: "Дезинфекция, дезинсекция, дератизация",
    description:
      "Във Вход Корект имаме богат опит в борбата с вредители, дезинсекцията срещу кърлежи и комари, както и в намаляването на гризачите в канализационните мрежи. Фокусирани сме върху внедряване на системи за контрол на вредителите, като поставяме акцент върху ограничаване до минимум на използваните биоциди.",
    buttonText: "Потърсете ни сега",
  },
  {
    title: "Озеленяване",
    description:
      "Вход Корект ООД е вашето решение за поддръжка на зелени площи. Ние предлагаме както еднократни услуги, така и абонаменти за задължителната поддръжка през целия сезон. Нашият екип ще направи предварителен оглед на пространството и ще се консултира с вас относно специфичните изисквания.",
    buttonText: "Потърсете ни сега",
  }
];

const initializeAnimations = () => {
  AOS.init({ duration: 1200, easing: "ease-out-cubic", once: true });
};

function ServiceConnector({ isLast }: { isLast: boolean }) {
  if (isLast) return null;

  return (
    <div className={styles.connector} data-aos="fade-up" aria-hidden="true">
      <div className={styles.connectorLine} />
      <div className={styles.connectorDotLeft} />
      <div className={styles.connectorDotRight} />
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className={styles.card} data-aos="fade-up">
      <div className={styles.cardGlow} aria-hidden="true" />
      <div className={styles.cardInner}>
        <h2 className={styles.cardTitle}>{service.title}</h2>
        <p className={styles.cardText}>{service.description}</p>

        <div className={styles.cardActions}>
          {/* No feature changes: button stays, no new links/endpoints */}
          <button type="button" className={styles.cta}>
            {service.buttonText}
          </button>
        </div>
      </div>
    </article>
  );
}

function ServiceHero() {
  return (
    <header className={styles.hero} aria-labelledby="service-three-title">
      {/* Keep background image exactly */}
      <div className={styles.heroBg} aria-hidden="true" />
      <div className={styles.heroOverlay} aria-hidden="true" />

      <div className={styles.heroInner}>
        <h1 id="service-three-title" className={styles.heroTitle} data-aos="fade-up">
          Допълнителни услуги
        </h1>
        <p className={styles.heroSubtitle} data-aos="fade-up" data-aos-delay="150">
          Поддръжка и съдействие с ясни стандарти, контрол и отговорност.
        </p>
      </div>
    </header>
  );
}

export function ServiceThree() {
  useEffect(initializeAnimations, []);

  return (
    <main className={styles.page}>
      <ServiceHero />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.stack}>
            {services.map((service, index) => (
              <div key={index} className={styles.item}>
                <ServiceCard service={service} />
                <ServiceConnector isLast={index === services.length - 1} />
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

export default ServiceThree;