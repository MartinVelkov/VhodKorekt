import React from "react";
import PropTypes from "prop-types";

import styles from "./css/Footer.module.css";

const year = new Date().getFullYear();

export function Footer({ title, description, menus, copyright }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Footer Top */}
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <h4 className={styles.title}>{title}</h4>

            {description ? <p className={styles.description}>{description}</p> : null}
          </div>

          {/* Menus */}
          <div className={styles.menus}>
            {menus.map(({ name, items }) => (
              <section key={name} className={styles.menu} aria-label={name}>
                <div className={styles.menuTitle}>{name}</div>

                <ul className={styles.menuList}>
                  {items.map((item) => (
                    <li key={item.name} className={styles.menuItem}>
                      <a href={item.path} className={styles.link}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Divider only on mobile for better scan (CSS controlled) */}
                <div className={styles.mobileDivider} aria-hidden="true" />
              </section>
            ))}
          </div>
        </div>

        <hr className={styles.hr} />

        {/* Footer Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copy}>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "Vhod Korekt",
  description: "",
  menus: [
    {
      name: "Услуги",
      items: [
        { name: "Професионален домоуправител", path: "/services/service1" },
        { name: "За кого е услугата", path: "/services/service2" },
        { name: "Допълнителни услуги", path: "/services/service3" },
      ],
    },
    {
      name: "Бързи връзки",
      items: [
        { name: "За нас", path: "/home" },
        { name: "Поддръжка", path: "/support" },
      ],
    },
    {
      name: "Контакти",
      items: [
        { name: "Телефон: +359 88 6459 652", path: "/contact" },
        { name: "Email: vhod.korekt@gmail.com", path: "/contact" },
        { name: "Адрес: гр.Перник, ул.'Димитър Благоев'44", path: "/contact" },
      ],
    },
  ],
  copyright: `© ${year} Вход Корект. Всички права са запазени`,
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  copyright: PropTypes.string.isRequired,
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;