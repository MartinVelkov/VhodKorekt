import React, { useEffect, useId, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  documentId,
} from "firebase/firestore";
import AddressCreatorPopup from "@/pages/portal/components/modal/AddAddressModal";
import logo from "@/img/1-removebg-preview.png";

import styles from "./Login.module.css";

export function Login() {
  const navigate = useNavigate();

  const subscriptionId = useId();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscription, setSubscription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep your behavior: set small screen once on mount (no resize listener)
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const width = window.innerWidth;
    setIsSmallScreen(width < 640);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1) Sign in
      await signInWithEmailAndPassword(auth, email.trim(), password);

      // 2) Fetch custom claims (kept, even if not currently used)
      await auth.currentUser?.getIdTokenResult();

      const num = subscription == "21123";
      const adminOne = email == "vhod.korekt@gmail.com";
      const adminTwo = email == "martivelkov5@gmail.com";

      if ((adminOne && num) || (adminTwo && num)) {
        navigate("/portal/ClientPage");
        return;
      }

      // NORMAL USER LOGIN LOGIC
      const colRef = collection(db, "clients");

      const snap = await getDocs(
        query(colRef, where("anum", "==", String(subscription || "").trim()), limit(2))
      );

      let docFound: any = null;

      if (!snap.empty) {
        docFound = snap.docs[0].data();
      } else {
        // fallback search by ID prefix
        const sub = String(subscription || "").trim();
        if (sub) {
          const snap2 = await getDocs(
            query(
              colRef,
              orderBy(documentId()),
              startAt(sub),
              endAt(sub + "\uf8ff"),
              limit(1)
            )
          );
          if (!snap2.empty) {
            docFound = snap2.docs[0].data();
          }
        }
      }

      if (!docFound) {
        setError("Не съществува клиент със този абонаментен номер");
        return;
      }

      // Remove apartment part
      const addr = docFound.address || "";
      const baseAddress = addr.replace(/\s+ап\.?\s*\S+$/i, "").trimEnd();

      navigate(`/portal/address?address=${encodeURIComponent(baseAddress)}`);
    } catch (err) {
      console.error(err);
      setError("Невалиден имейл или парола");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={isSmallScreen ? styles.shellMobile : styles.shellDesktop}>
        {/* Left / Brand panel (hidden on small screens) */}
        <section className={styles.brandPanel} aria-hidden={isSmallScreen}>
          <div className={styles.brandInner}>
            <h1 className={styles.brandTitle}>Здравейте отново!</h1>
            <p className={styles.brandSubtitle}>
              Вход Корект — достъп до информация и отчетност в реално време.
            </p>
            <img className={styles.brandLogo} src={logo} alt="Вход Корект" />
          </div>
        </section>

        {/* Right / Form panel */}
        <section className={styles.formPanel} aria-label="Вход в профила">
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              {isSmallScreen ? (
                <img className={styles.mobileLogo} src={logo} alt="Вход Корект" />
              ) : null}

              <h2 className={styles.title}>Влез</h2>

              <p className={styles.helper}>
                Нямаш адрес?{" "}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => setShowPopup(true)}
                >
                  Заявeте тук
                </button>
              </p>

              {showPopup && <AddressCreatorPopup onClose={() => setShowPopup(false)} />}
            </div>

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={subscriptionId}>
                  Абонаментен номер
                </label>
                <input
                  id={subscriptionId}
                  className={styles.input}
                  type="number"
                  inputMode="numeric"
                  value={subscription}
                  onChange={(e) => setSubscription(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={emailId}>
                  Имейл адрес
                </label>
                <input
                  id={emailId}
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={passwordId}>
                  Парола
                </label>
                <input
                  id={passwordId}
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />

                <div className={styles.forgotRow}>
                  <a className={styles.forgotLink} href="/forgot-password">
                    Забравена парола?
                  </a>
                </div>
              </div>

              {error ? (
                <div className={styles.error} role="alert" aria-live="polite">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className={styles.submit}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Влизане…" : "Влез"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;