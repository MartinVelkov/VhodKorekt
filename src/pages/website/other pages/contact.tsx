import React, { useEffect, useId, useState } from "react";
import { Footer } from "@/widgets/layout";
import AOS from "aos";
import "aos/dist/aos.css";
import { FormControl, Select, MenuItem } from "@mui/material";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { PhoneIcon, EnvelopeIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import logo from "@/img/1-removebg-preview.png";

import styles from "../css/ContactForm.module.css";

export function ContactForm() {
  useEffect(() => {
    AOS.init();
  }, []);

  const nameId = useId();
  const emailId = useId();
  const cityId = useId();
  const messageId = useId();

  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: any) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const messageRef = doc(collection(db, "suobshtenia"));
      const messageData = {
        name,
        email,
        city,
        message,
        createdAt: new Date(),
      };

      await setDoc(messageRef, messageData);

      alert("Message sent successfully!");
      setName("");
      setEmail("");
      setCity("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero} aria-labelledby="contact-hero-title">
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroInner}>
          <img
            src={logo}
            alt="Вход Корект"
            className={styles.logo}
            data-aos="fade-up"
            data-aos-duration="1500"
            loading="eager"
            decoding="async"
          />

          <h1
            id="contact-hero-title"
            className={styles.heroTitle}
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            Свържете се с нас
          </h1>

          <p className={styles.heroSubtitle}>
            Изпратете запитване и ще се свържем с вас възможно най-скоро.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Form Card */}
            <section className={styles.card} data-aos="fade-up" data-aos-duration="1500" aria-label="Форма за контакт">
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Изпратете съобщение</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={nameId}>
                      Име
                    </label>
                    <input
                      id={nameId}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.input}
                      placeholder="Вашето име"
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={emailId}>
                      Имейл
                    </label>
                    <input
                      id={emailId}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                      placeholder="Вашият имейл"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={cityId}>
                      Град
                    </label>

                    <FormControl className={styles.muiControl} fullWidth>
                      <Select
                        id={cityId}
                        value={city}
                        onChange={handleChange}
                        displayEmpty
                        className={styles.muiSelect}
                        inputProps={{ "aria-label": "Град" }}
                        MenuProps={{
                          PaperProps: { className: styles.muiMenuPaper },
                        }}
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value={"Перник"}>Перник</MenuItem>
                        <MenuItem value={"София"}>София</MenuItem>
                        <MenuItem value={"Радомир"}>Радомир</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor={messageId}>
                      Съобщение
                    </label>
                    <textarea
                      id={messageId}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={styles.textarea}
                      placeholder="Вашето съобщение"
                      rows={5}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? "Изпращане..." : "Изпратете съобщение"}
                  </button>
                </form>
              </div>
            </section>

            {/* Info Cards */}
            <div
              className={styles.info}
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay="300"
            >
              <section className={styles.infoCard} aria-label="Адрес">
                <div className={styles.infoBody}>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <BuildingOfficeIcon className={styles.icon} />
                  </span>
                  <div className={styles.infoText}>
                    <div className={styles.infoLabel}>Адрес</div>
                    <div className={styles.infoValue}>гр.Перник, ул.'Димитър Благоев'44</div>
                  </div>
                </div>
              </section>

              <section className={styles.infoCard} aria-label="Телефон">
                <div className={styles.infoBody}>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <PhoneIcon className={styles.icon} />
                  </span>
                  <div className={styles.infoText}>
                    <div className={styles.infoLabel}>Телефон</div>
                    <div className={styles.infoValue}>+359 88 6459 652</div>
                  </div>
                </div>
              </section>

              <section className={styles.infoCard} aria-label="Имейл">
                <div className={styles.infoBody}>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <EnvelopeIcon className={styles.icon} />
                  </span>
                  <div className={styles.infoText}>
                    <div className={styles.infoLabel}>Имейл</div>
                    <div className={styles.infoValue}>vhod.korekt@gmail.com</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footerWrap}>
        <Footer />
      </footer>
    </div>
  );
}