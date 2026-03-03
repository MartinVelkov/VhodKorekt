import React, { useRef, useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

import styles from "./css/Navbar.module.css";

function Navbar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [user] = useAuthState(auth);

  const menuId = useId();

  // Separate refs so “click outside” works reliably
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileDrawerRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleNav = () => {
    setIsNavOpen((v) => !v);
  };

  const toggleServices = () => {
    setIsServicesOpen((v) => !v);
  };

  // Close desktop dropdown when clicking outside it
  useEffect(() => {
    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      // Desktop dropdown close
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(target)) {
        setAnchorEl(null);
      }

      // Mobile drawer close (only if open and click is outside)
      if (isNavOpen && mobileDrawerRef.current && !mobileDrawerRef.current.contains(target)) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isNavOpen]);

  // Escape key closes open UI
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAnchorEl(null);
        setIsServicesOpen(false);
        setIsNavOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isDesktopDropdownOpen = Boolean(anchorEl);

  return (
    <nav className={styles.nav} aria-label="Главна навигация">
      <div className={styles.container}>
        <Link className={styles.brand} to="/home" aria-label="Начало">
          Вход Корект
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={toggleNav}
          aria-label={isNavOpen ? "Затвори менюто" : "Отвори менюто"}
          aria-expanded={isNavOpen}
          aria-controls={`${menuId}-mobile-drawer`}
        >
          <Bars3Icon className={styles.icon} />
        </button>

        {/* Desktop links */}
        <ul className={styles.desktopNav}>
          <li>
            <Link className={styles.link} to="/home">
              За нас
            </Link>
          </li>
          <li>
            <Link className={styles.link} to="/blog">
              Блог
            </Link>
          </li>

          <li className={styles.servicesWrap}>
            <button
              type="button"
              className={styles.servicesBtn}
              aria-haspopup="menu"
              aria-expanded={isDesktopDropdownOpen}
              aria-controls={`${menuId}-services-menu`}
              onClick={handleClick}
            >
              Услуги <span className={styles.chev} aria-hidden="true">▾</span>
            </button>

            <div
              ref={desktopDropdownRef}
              id={`${menuId}-services-menu`}
              role="menu"
              className={`${styles.dropdown} ${isDesktopDropdownOpen ? styles.dropdownOpen : ""}`}
            >
              <Link onClick={handleClose} to="/services/service1" className={styles.dropdownItem} role="menuitem">
                Професионален домоуправител
              </Link>
              <Link onClick={handleClose} to="/services/service2" className={styles.dropdownItem} role="menuitem">
                За кого е услугата
              </Link>
              <Link onClick={handleClose} to="/services/service3" className={styles.dropdownItem} role="menuitem">
                Допълнителни услуги
              </Link>
            </div>
          </li>

          <li>
            <Link className={styles.link} to="/contact">
              Контакти
            </Link>
          </li>

          <li>
            <Link className={styles.cta} to="/login">
              Влезни в акаунта си
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile backdrop (click closes) */}
      <button
        type="button"
        className={`${styles.backdrop} ${isNavOpen ? styles.backdropOpen : ""}`}
        aria-hidden={!isNavOpen}
        tabIndex={isNavOpen ? 0 : -1}
        onClick={() => setIsNavOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        id={`${menuId}-mobile-drawer`}
        ref={mobileDrawerRef}
        className={`${styles.drawer} ${isNavOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!isNavOpen}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>Меню</div>
          <button type="button" className={styles.drawerClose} onClick={toggleNav} aria-label="Затвори менюто">
            <XMarkIcon className={styles.icon} />
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Мобилна навигация">
          <Link className={styles.drawerLink} to="/home" onClick={toggleNav}>
            За нас
          </Link>
          <Link className={styles.drawerLink} to="/blog" onClick={toggleNav}>
            Блог
          </Link>

          <button type="button" className={styles.drawerServicesBtn} onClick={toggleServices} aria-expanded={isServicesOpen}>
            <span>Услуги</span>
            <span className={`${styles.chev} ${isServicesOpen ? styles.chevUp : ""}`} aria-hidden="true">▾</span>
          </button>

          {isServicesOpen && (
            <div className={styles.drawerSubnav}>
              <Link className={styles.drawerSublink} to="/services/service1" onClick={toggleNav}>
                Професионален домоуправител
              </Link>
              <Link className={styles.drawerSublink} to="/services/service2" onClick={toggleNav}>
                За кого е услугата
              </Link>
              <Link className={styles.drawerSublink} to="/services/service3" onClick={toggleNav}>
                Допълнителни услуги
              </Link>
            </div>
          )}

          <Link className={styles.drawerLink} to="/contact" onClick={toggleNav}>
            Контакти
          </Link>

          <Link className={styles.drawerCta} to="/login" onClick={toggleNav}>
            Влезни в акаунта си
          </Link>
        </nav>
      </aside>
    </nav>
  );
}

export default Navbar;