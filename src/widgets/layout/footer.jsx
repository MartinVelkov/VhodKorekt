import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

const year = new Date().getFullYear();

export function Footer({ title, description, menus, copyright }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenWidth(); // Initial check

    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return (
    <footer className="relative px-4 pt-20 pb-10">
      <div className="container mx-auto">
        {/* Footer Top Section */}
        <div className="flex flex-wrap pt-6 lg:justify-between">
          {/* VhodKorekt section on the left */}
          <div className="w-full lg:w-4/12 text-left mb-6">
            <Typography variant="h4" className="mb-4" color="blue-gray">
              {title}
            </Typography>
          </div>

          {/* Menus section on the right */}
          <div className="w-full lg:w-8/12 flex flex-wrap justify-between mt-12 lg:mt-0 mb-16">
            {menus.map(({ name, items }) => (
              <div key={name} className="w-full sm:w-1/2 lg:w-1/3 mb-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 block font-medium uppercase"
                >
                  {name}
                </Typography>
                <ul className="mt-3">
                  {items.map((item) => (
                    <li key={item.name}>
                      <Typography
                        as="a"
                        href={item.path}
                        variant="small"
                        className="mb-3 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                      >
                        {item.name}
                      </Typography>
                    </li>
                  ))}
                  {isSmallScreen && <hr className="my-6 border-gray-300" />}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {isSmallScreen || <hr className="my-6 border-gray-300" />}
        {/* Footer Bottom Section */}
        <div className="flex flex-wrap items-center justify-center md:justify-between mt-0">
          <div className="w-full text-center md:text-center">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              {copyright}
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "VhodKorekt",
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
  copyright: `© ${year} ВходКорект. Всички права са запазени`,
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