import React, { useEffect, useId, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./css/Navbar.module.css";
import AccountBubble from "@/pages/portal/components/AccountBubble"; // ✅ add this

const links = [
  { to: "/portal/ClientPage", label: "Клиенти" },
  { to: "/portal/epayPage", label: "EasyPay" },
  { to: "/portal/stats", label: "Статистика" },
] as const;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Close when switching to desktop (prevents stuck-open state)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setIsOpen(false);
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <nav className={styles.nav} aria-label="Портал навигация">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.brandText}>Портал</span>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={isOpen ? "Затвори меню" : "Отвори меню"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span
            className={`${styles.bars} ${isOpen ? styles.barsOpen : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* Links */}
        <div
          id={menuId}
          className={`${styles.links} ${isOpen ? styles.linksOpen : ""}`}
          role="navigation"
          aria-label="Основни секции"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={() => setIsOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* ✅ Account bubble with logout + settings modal */}
        <div className={styles.accountSlot}>
          <AccountBubble />
        </div>

        {/* Optional overlay for click-outside close */}
        {isOpen && (
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Затвори меню"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;