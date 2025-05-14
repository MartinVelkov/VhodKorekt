import React from "react";
import {
  Typography,
} from "@material-tailwind/react";
import { Footer } from "@/widgets/layout";
import AOS from "aos";
import "aos/dist/aos.css";
import { WalletIcon,UserGroupIcon, AcademicCapIcon,WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

export function ServiceOne() {
  React.useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="mt-16">
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4 py-16 lg:py-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-6 font-bold text-3xl sm:text-4xl lg:text-5xl"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              Професионален домоуправител
            </Typography>
          </div>
        </div>
      </div>
      {/* Service Highlights Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            <div
              className="w-full md:w-5/12 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <Typography variant="h3" className="mb-3 font-bold text-gray-800">
                Упревление и организация
              </Typography>
              <Typography className="font-normal text-gray-600">
                Нужен Ви е професионален домоуправител, който знае и най-малките
                подробности за сградата Ви. Изберете подготвен, обучен,
                компетентен персонален акаунт мениджър.
              </Typography>
            </div>
            <div
              className="w-full md:w-5/12 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay="300"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
                <WalletIcon className="h-8 w-8 text-white" />
              </div>
              <Typography variant="h3" className="mb-3 font-bold text-gray-800">
                Бюджет и финанси
              </Typography>
              <Typography className="font-normal text-gray-600">
                Нашият финансов отдел е отговорен за плащането на сметките Ви,
                събирането на месечни вноски, изготвянето на подробните отчети
                за разходи и приходи.
              </Typography>
            </div>
            <div
              className="w-full md:w-5/12 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay="600"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
                <WrenchScrewdriverIcon className="h-8 w-8 text-white" />
              </div>
              <Typography variant="h3" className="mb-3 font-bold text-gray-800">
                Техническа поддръжка и ремонти
              </Typography>
              <Typography className="font-normal text-gray-600">
                Ежеседмичен преглед на инсталации и общи части. Ние ще съберем
                оферти и ще осъществим необходимите ремонти. Търсете съдействие
                24 часа, всеки ден в годината. Работим с реномираните
                изпълнители в бранша.
              </Typography>
            </div>
            <div
              className="w-full md:w-5/12 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-delay="900"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <Typography variant="h3" className="mb-3 font-bold text-gray-800">
                Юридическа част
              </Typography>
              <Typography className="font-normal text-gray-600">
                Юридическият ни екип се състои от опитни медиатори и юристи,
                които ще разрешат всеки възникнал казус.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default ServiceOne;
