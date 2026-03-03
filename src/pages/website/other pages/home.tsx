import React, { useEffect } from "react";
import { Footer } from "@/widgets/layout";
import AOS from "aos";
import Navbar from "@/widgets/layout/navbar";
import logo from "../../../img/1-removebg-preview.png";
import One from "../../../img/homeImageOne.jpeg";
import Two from "../../../img/homeImageTwo.png";
import Three from "../../../img/homeImageThree.jpeg";

import styles from "../css/Home.module.css";

export function Home() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero} aria-labelledby="home-hero-title">
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={styles.heroNoise} aria-hidden="true" />
          <div className={styles.heroGlow} aria-hidden="true" />

          <div className={styles.heroInner}>
            <img
              src={logo}
              alt="Вход Корект"
              className={styles.logo}
              data-aos="fade-up"
              data-aos-duration="1200"
              loading="eager"
              decoding="async"
            />

            <h1
              id="home-hero-title"
              className={styles.heroTitle}
              data-aos="fade-up"
              data-aos-delay="150"
              data-aos-duration="1200"
            >
              Вашият Домоуправител
            </h1>

            <p
              className={styles.heroSubtitle}
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1200"
            >
              Професионално управление • Прозрачност • Доверие
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className={styles.band}>
          <div className={styles.container}>
            <div className={styles.sectionGrid}>
              <div className={styles.textCol}>
                <div className={styles.textPanel}>
                  <p className={styles.bodyText}>
                    Вход Корект е динамично развиваща се компания, създадена с
                    мисията да предоставя професионални услуги по управление на
                    сгради в режим на етажна собственост и жилищни комплекси.
                    Вход Корект се фокусира върху предоставянето на качествени
                    решения за поддръжка и управление на жилищни и търговски
                    сгради, независимо от тяхната сложност и мащаб.
                  </p>
                </div>
              </div>

              <div className={styles.mediaCol}>
                <figure className={styles.mediaCard}>
                  <img
                    src={One}
                    alt="Вход Корект – услуги и управление"
                    className={styles.mediaImg}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className={styles.bandAlt}>
          <div className={styles.container}>
            <div className={`${styles.sectionGrid} ${styles.reverseAtDesktop}`}>
              <div className={styles.textCol}>
                <div className={styles.textPanel}>
                  <p className={styles.bodyText}>
                    Компанията се утвърждава като ключов играч на пазара,
                    благодарение на иновативния си подход, съчетаващ модерни
                    технологии и персонализирани услуги, адаптирани към нуждите
                    на всеки клиент.
                  </p>
                </div>
              </div>

              <div className={styles.mediaCol}>
                <figure className={styles.mediaCard}>
                  <img
                    src={Two}
                    alt="Вход Корект – иновативен подход"
                    className={styles.mediaImg}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className={styles.band}>
          <div className={styles.container}>
            <div className={styles.sectionGrid}>
              <div className={styles.textCol}>
                <div className={styles.textPanel}>
                  <p className={styles.bodyText}>
                    Вход Корект залага на високите стандарти на професионализъм и
                    прозрачност, които гарантират дългосрочни партньорства и
                    удовлетвореност на клиентите. Разработената от компанията
                    дигитална платформа позволява ефективен мониторинг и
                    управление на всички процеси, свързани с поддръжката на
                    сградите, като същевременно осигурява лесна комуникация и
                    отчетност.
                  </p>
                </div>
              </div>

              <div className={styles.mediaCol}>
                <figure className={styles.mediaCard}>
                  <img
                    src={Three}
                    alt="Вход Корект – дигитална платформа"
                    className={styles.mediaImg}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <footer className={styles.footerWrap}>
          <Footer />
        </footer>
      </main>
    </>
  );
}

export default Home;