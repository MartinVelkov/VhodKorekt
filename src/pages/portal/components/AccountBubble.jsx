import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";
import { useAuth } from "@/pages/portal/contexts/AuthContext";
import styles from "./css/AccountBubble.module.css";
import { showAlert } from "./alert";
import defaultUser from "@/img/defaultUser.png"; 
/* -------------------------
   Helpers
------------------------- */

function roleLabel(claims) {
  const role =
    (typeof claims?.role === "string" && claims.role) ||
    (claims?.owner && "owner") ||
    (claims?.admin && "admin") ||
    (claims?.seller && "seller") ||
    "user";

  if (role === "owner") return "Собственик";
  if (role === "admin") return "Администратор";
  if (role === "seller") return "Продавач";
  return "Потребител";
}

async function loadUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

async function saveUserProfile(uid, data) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, data, { merge: true });
}

function useOnClickOutside(refs, handler) {
  useEffect(() => {
    const onDown = (e) => {
      const clickedInside = refs.some(
        (r) => r.current && r.current.contains(e.target)
      );
      if (!clickedInside) handler();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [refs, handler]);
}

/* -------------------------
   Component
------------------------- */

export default function AccountBubble() {
  const { user, claims, loading } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [phone, setPhone] = useState("");

  // Password / email verification
  const [pwSending, setPwSending] = useState(false);
  const [verSending, setVerSending] = useState(false);
  const [verRefreshing, setVerRefreshing] = useState(false);

  // Phone change with SMS verification (Phone Auth)
  const [newPhone, setNewPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [smsStep, setSmsStep] = useState("idle"); // idle | codeSent | verifying
  const [confirmRes, setConfirmRes] = useState(null);

  const bubbleRef = useRef(null);
  const menuRef = useRef(null);

  // reCAPTCHA container for Phone Auth
  const recaptchaRef = useRef(null);
  const verifierRef = useRef(null);

  useOnClickOutside([bubbleRef, menuRef], () => setOpenMenu(false));

  const labelRole = useMemo(() => roleLabel(claims), [claims]);

  // Initialize fields on user change
  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || "");
    setPhotoURL(user.photoURL || "");
  }, [user]);

  // Load profile data when opening settings (phone from Firestore)
  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!openSettings || !user?.uid) return;
      try {
        setProfileLoading(true);
        const p = await loadUserProfile(user.uid);
        if (!alive) return;
        setPhone(p?.phone || "");
      } catch (e) {
        console.error("[AccountBubble] load profile error:", e);
      } finally {
        if (alive) setProfileLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [openSettings, user?.uid]);

  // Cleanup phone auth session when closing modal
  useEffect(() => {
    if (openSettings) return;

    setNewPhone("");
    setSmsCode("");
    setSmsStep("idle");
    setConfirmRes(null);

    // Clear verifier instance (safe)
    try {
      if (verifierRef.current?.clear) verifierRef.current.clear();
    } catch (_) {}
    verifierRef.current = null;
  }, [openSettings]);

  const ensureRecaptcha = () => {
    if (verifierRef.current) return verifierRef.current;
    if (!recaptchaRef.current) {
      throw new Error("reCAPTCHA container missing");
    }

    // Create an invisible reCAPTCHA verifier attached to the modal
    verifierRef.current = new RecaptchaVerifier(auth, recaptchaRef.current, {
      size: "invisible",
    });

    return verifierRef.current;
  };

  const onLogout = async () => {
    try {
      setOpenMenu(false);
      await signOut(auth);
    } catch (e) {
      console.error("[AccountBubble] logout error:", e);
      showAlert("Неуспешен изход. Опитай пак.", "error", 5000);
    }
  };

  /* -------------------------
     Security actions
  ------------------------- */

  const onSendPasswordReset = async () => {
    const email = user?.email;
    if (!email) {
      showAlert("Няма намерен имейл към този профил.", "error", 5000);
      return;
    }

    try {
      setPwSending(true);
      await sendPasswordResetEmail(auth, email);
      showAlert(
        `Изпратихме имейл за смяна на парола до: ${email}. Проверете и Spam.`,
        "success",
        7000
      );
    } catch (e) {
      console.error("[AccountBubble] password reset error:", e);
      showAlert("Неуспешно изпращане на имейл за смяна на парола.", "error", 6000);
    } finally {
      setPwSending(false);
    }
  };

  const onSendEmailVerification = async () => {
    if (!user) return;
    if (!user.email) {
      showAlert("Няма имейл към този профил.", "error", 5000);
      return;
    }
    if (user.emailVerified) {
      showAlert("Имейлът вече е потвърден ✅", "success", 4000);
      return;
    }

    try {
      setVerSending(true);
      await sendEmailVerification(user);
      showAlert(
        `Изпратихме имейл за потвърждение до: ${user.email}. Проверете и Spam.`,
        "success",
        7000
      );
    } catch (e) {
      console.error("[AccountBubble] email verification error:", e);
      showAlert("Неуспешно изпращане на имейл за потвърждение.", "error", 6000);
    } finally {
      setVerSending(false);
    }
  };

  const onRefreshVerification = async () => {
    if (!user) return;
    try {
      setVerRefreshing(true);
      await reload(user);
      showAlert("Статусът е обновен.", "success", 3000);
    } catch (e) {
      console.error("[AccountBubble] reload user error:", e);
      showAlert("Неуспешно обновяване на статуса.", "error", 5000);
    } finally {
      setVerRefreshing(false);
    }
  };

  /* -------------------------
     Phone change via SMS verification
  ------------------------- */

  const onSendPhoneCode = async () => {
    if (!user) return;

    const phoneTrim = newPhone.trim();
    if (!phoneTrim) {
      showAlert("Въведи нов телефонен номер.", "error", 4000);
      return;
    }

    try {
      setSmsStep("verifying");

      const verifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phoneTrim, verifier);

      setConfirmRes(confirmation);
      setSmsStep("codeSent");
      showAlert("Кодът е изпратен по SMS.", "success", 4000);
    } catch (e) {
      console.error("[AccountBubble] send phone code error:", e);
      setSmsStep("idle");
      showAlert(
        "Неуспешно изпращане на SMS код. Провери номера и опитай пак.",
        "error",
        7000
      );
    }
  };

  const onConfirmPhoneCodeAndSave = async () => {
    if (!user) return;

    if (!confirmRes) {
      showAlert("Няма активна заявка за код. Изпрати код отново.", "error", 5000);
      return;
    }
    const codeTrim = smsCode.trim();
    if (!codeTrim) {
      showAlert("Въведи кода от SMS.", "error", 4000);
      return;
    }

    try {
      setSmsStep("verifying");

      // Confirms the SMS code (Phone Auth)
      await confirmRes.confirm(codeTrim);

      // Save verified phone in Firestore
      const phoneTrim = newPhone.trim();
      await saveUserProfile(user.uid, {
        phone: phoneTrim,
        phoneVerifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setPhone(phoneTrim);
      setNewPhone("");
      setSmsCode("");
      setConfirmRes(null);
      setSmsStep("idle");

      showAlert("Телефонът е обновен успешно.", "success", 5000);
    } catch (e) {
      console.error("[AccountBubble] confirm phone code error:", e);
      setSmsStep("codeSent");
      showAlert("Грешен код или изтекла сесия. Опитай пак.", "error", 7000);
    }
  };

  /* -------------------------
     Save profile changes (name/photo)
  ------------------------- */

  const onSave = async () => {
    if (!user) return;

    if (displayName.trim().length < 2) {
      showAlert("Името трябва да е поне 2 символа.", "error", 4000);
      return;
    }

    try {
      setSaving(true);

      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: photoURL.trim() || null,
      });

      // We do NOT save `phone` directly here anymore; phone change is SMS-verified above.
      await saveUserProfile(user.uid, {
        updatedAt: new Date().toISOString(),
      });

      setOpenSettings(false);
      setOpenMenu(false);

      showAlert("Промените са запазени.", "success", 4000);
    } catch (e) {
      console.error("[AccountBubble] save error:", e);
      showAlert("Неуспешно запазване. Опитай пак.", "error", 6000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.accountWrap} ref={bubbleRef}>
      <button
        type="button"
        className={styles.accountBubble}
        onClick={() => !loading && user && setOpenMenu((v) => !v)}
        disabled={loading || !user}
        aria-haspopup="menu"
        aria-expanded={openMenu}
      >
        {loading ? (
          <span>Зареждане…</span>
        ) : user ? (
          <>
            <img
              src={user.photoURL || defaultUser}
              className={styles.accountImg}
              alt="profile"
            />
            <div className={styles.accountText}>
              <strong className={styles.accountName}>
                {user.displayName || user.email || "Потребител"}
              </strong>
              <p className={styles.accountRole}>{labelRole}</p>
            </div>
          </>
        ) : (
          <span>Не сте влезли</span>
        )}
      </button>

      {openMenu && user && (
        <div className={styles.accountMenu} ref={menuRef} role="menu">
          <button
            type="button"
            className={styles.menuItem}
            onClick={() => {
              setOpenSettings(true);
              setOpenMenu(false);
            }}
          >
            Настройки
          </button>

          <div className={styles.menuDivider} />

          <button
            type="button"
            className={styles.menuItemDanger}
            onClick={onLogout}
          >
            Изход
          </button>
        </div>
      )}

      {/* Settings Modal */}
      {openSettings && user && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Настройки на профила</h3>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => !saving && setOpenSettings(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {profileLoading ? (
              <div className={styles.modalBody}>Зареждане…</div>
            ) : (
              <div className={styles.modalBody}>
                <label className={styles.field}>
                  <span className={styles.label}>Име</span>
                  <input
                    className={styles.input}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Име и фамилия"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Снимка (URL)</span>
                  <input
                    className={styles.input}
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://..."
                  />
                </label>

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Телефон (SMS потвърждение)</div>

                  <div className={styles.infoMsg}>
                    Текущ телефон: <strong>{phone || "—"}</strong>
                  </div>

                  <label className={styles.field}>
                    <span className={styles.label}>Нов телефон</span>
                    <input
                      className={styles.input}
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+359..."
                    />
                  </label>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={onSendPhoneCode}
                      disabled={smsStep === "verifying"}
                    >
                      {smsStep === "verifying" ? "Изпращане…" : "Изпрати код"}
                    </button>

                    {smsStep === "codeSent" && (
                      <>
                        <input
                          className={styles.input}
                          value={smsCode}
                          onChange={(e) => setSmsCode(e.target.value)}
                          placeholder="Код"
                          style={{ maxWidth: 160 }}
                        />
                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={onConfirmPhoneCodeAndSave}
                          disabled={smsStep === "verifying"}
                        >
                          {smsStep === "verifying" ? "Потвърждаване…" : "Потвърди и запази"}
                        </button>
                      </>
                    )}
                  </div>

                  <small className={styles.help}>
                    Телефонът се записва в Firestore (users/{user.uid}) само след SMS код.
                  </small>

                  {/* Required for Firebase reCAPTCHA */}
                  <div ref={recaptchaRef} />
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Сигурност</div>

                  <div className={styles.infoMsg}>
                    Имейл: <strong>{user.email || "—"}</strong>{" "}
                    {user.emailVerified ? (
                      <span style={{ marginLeft: 8 }}>✅ Потвърден</span>
                    ) : (
                      <span style={{ marginLeft: 8 }}>⚠️ Непотвърден</span>
                    )}
                  </div>

                  {!user.emailVerified && (
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={onSendEmailVerification}
                      disabled={verSending}
                    >
                      {verSending ? "Изпращане…" : "Изпрати имейл за потвърждение"}
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={onRefreshVerification}
                    disabled={verRefreshing}
                  >
                    {verRefreshing ? "Обновяване…" : "Обнови статус потвърждение"}
                  </button>

                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={onSendPasswordReset}
                    disabled={pwSending}
                  >
                    {pwSending ? "Изпращане…" : "Смяна на парола (по имейл)"}
                  </button>
                </div>
              </div>
            )}

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setOpenSettings(false)}
                disabled={saving}
              >
                Отказ
              </button>

              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onSave}
                disabled={saving || profileLoading}
              >
                {saving ? "Запазване…" : "Запази"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}