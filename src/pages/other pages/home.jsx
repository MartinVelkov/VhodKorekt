import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Footer } from "@/widgets/layout";
import AOS from "aos";
import Navbar from "../../navbar/navbar";
import logo from "../../img/1-removebg-preview.png";
import One from "../../img/homeImageOne.jpeg";
import Two from "../../img/homeImageTwo.png";
import Three from "../../img/homeImageThree.jpeg";

export function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  React.useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="mt-16">
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4 py-16 lg:py-32">
            <img src={logo} alt="Logo" className="mx-auto mb-6 w-84 h-72" data-aos="fade-up" data-aos-duration="1500" />
            <Typography
              variant="h1"
              color="white"
              className="mb-6 font-bold text-3xl sm:text-4xl lg:text-5xl animate__animated animate__fadeIn"
              data-aos="fade-up"
              data-aos-duration="1500"
              style={{ lineHeight: "1.4", letterSpacing: "1px" }}
            >
              За ВходКорект
            </Typography>
          </div>
        </div>

        {/* Section 1 - Gradient Fade from Left to Right */}
        <section className="bg-gradient-to-r from-[#111e3d] to-[#28163d] py-24">
          <div className="container mx-auto flex flex-wrap items-center justify-center">
            {/* Text on the Left */}
            <div className="w-full md:w-1/2 px-4">
              <Typography
                className="font-normal text-[#d9e2f5] text-lg leading-relaxed"
                style={{ maxWidth: "800px" }}
              >
                ВходКорект е динамично развиваща се компания, създадена
                с мисията да предоставя професионални услуги по управление
                на сгради в режим на етажна собственост и жилищни комплекси.
                ВходКорект се фокусира върху предоставянето на качествени
                решения за поддръжка и управление на жилищни и търговски
                сгради, независимо от тяхната сложност и мащаб.
              </Typography>
            </div>
            {/* Image on the Right */}
            <div className="w-full md:w-1/2 px-4">
              <img src={One} alt="Section 1" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-gradient-to-r from-[#111e3d] to-[#28163d] py-24">
          <div className="container mx-auto flex flex-wrap items-center justify-center">
            {/* Image on the Left */}
            <div className="w-full md:w-1/2 px-4">
              <img src={Two} alt="Section 2" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            {/* Text on the Right */}
            <div className="w-full md:w-1/2 px-4">
              <Typography
                className="font-normal text-[#d9e2f5] text-lg leading-relaxed"
                style={{ maxWidth: "800px" }}
              >
                Компанията се утвърждава като ключов играч на пазара,
                благодарение на иновативния си подход, съчетаващ модерни
                технологии и персонализирани услуги, адаптирани към
                нуждите на всеки клиент.
              </Typography>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-gradient-to-r from-[#111e3d] to-[#28163d] py-24">
          <div className="container mx-auto flex flex-wrap items-center justify-center">
            {/* Text on the Left */}
            <div className="w-full md:w-1/2 px-4">
              <Typography
                className="font-normal text-[#d9e2f5] text-lg leading-relaxed"
                style={{ maxWidth: "800px" }}
              >
                ВходКорект залага на високите стандарти на професионализъм
                и прозрачност, които гарантират дългосрочни партньорства и
                удовлетвореност на клиентите. Разработената от компанията
                дигитална платформа позволява ефективен мониторинг и управление
                на всички процеси, свързани с поддръжката на сградите, като
                същевременно осигурява лесна комуникация и отчетност.
              </Typography>
            </div>
            {/* Image on the Right */}
            <div className="w-full md:w-1/2 px-4">
              <img src={Three} alt="Section 3" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="bg-white">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;