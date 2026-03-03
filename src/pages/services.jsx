import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData } from "@/data";
import AOS from 'aos';
import 'aos/dist/aos.css';

export function Services() {
  React.useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      {/* Hero Section */}
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
            Услуги
          </Typography>
          <Typography
            variant="lead"
            color="white"
            className="opacity-80 max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl"
            data-aos="fade-up"
            data-aos-duration="2000"
            data-aos-delay="300"
          >
            Ние сме малка компания коертвергверг дфг ер гвег дфг вергс дфгвер гдфг сдфгв
            ергдфгсер вег сдфг верг дфгсдгер ге гсдфг вергс дфгвер гд фгсергв ерг сергсе ргс
            р дерррррррррррррррррррррре сг  ер ге с ер г сер г серг с ерг с ер г сер гс
          </Typography>
        </div>
      </div>

      {/* Features Section */}
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
  <div className="container mx-auto">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {featuresData.map(({ color, title, icon, photo }) => (
        <FeatureCard
          key={title}
          color={color}
          title={title}
          icon={React.createElement(icon, {
            className: "w-5 h-5 text-white",
          })}
          photo={<img src={photo} alt={title} className="w-full h-40 object-cover" />}
          className="transition-transform duration-300 hover:scale-105"
          data-aos="fade-up"
          data-aos-duration="1500"
        />
      ))}
    </div>
  </div>
</section>


      {/* Service Highlights Section */}
      <section className="px-4 pt-20 pb-48">
  <div className="container mx-auto">
    <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
      <div
        className="w-full md:w-80 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
          <FingerPrintIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          variant="h3"
          className="mb-3 font-bold text-gray-800 text-xl"
        >
          Управление и организация
        </Typography>
        <Typography className="text-gray-600 leading-relaxed">
          Персонален акаунт мениджър – професионален домоуправител – обучен, подготвен, компетентен. Той знае всичко за вашата сграда, провежда общите събрания, изпълнява решенията, реагира при аварии, съдейства за разрешаването на всякакъв вид проблеми касаещи общата собственост. Комуникира с контрагенти, подизпълнители, собственици, както и с управителния съвет на сградата.
        </Typography>
      </div>
      <div
        className="w-full md:w-80 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
        data-aos="fade-up"
        data-aos-duration="1500"
        data-aos-delay="300"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
          <FingerPrintIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          variant="h3"
          className="mb-3 font-bold text-gray-800 text-xl"
        >
          Бюджет и финанси
        </Typography>
        <Typography className="text-gray-600 leading-relaxed">
          Финансов отдел – събираме месечните вноски, плащаме вашите сметки, изготвяме подробни отчети за приходите и разходите на вашата сграда, събираме целеви средства за ремонти, водим стриктно счетоводство, изготвяме финансови анализи, оптимизираме бюджета на етажната собственост и най-вече носим отговорност и гаранция за вашите средства.
        </Typography>
      </div>
      <div
        className="w-full md:w-80 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
        data-aos="fade-up"
        data-aos-duration="1500"
        data-aos-delay="600"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
          <FingerPrintIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          variant="h3"
          className="mb-3 font-bold text-gray-800 text-xl"
        >
          Техническа поддръжка и ремонти
        </Typography>
        <Typography className="text-gray-600 leading-relaxed">
          Събираме оферти, осъществяваме капиталови и неотложни ремонти. Работим с всички реномирани изпълнители в страната. Извършваме ежеседмични проверки на техническата изправност на инсталациите и съоръженията във вашата сграда. При нужда от ремонт реагираме бързо и коректно. При аварийни ситуации може да разчитате на нашите мобилни екипи за незабавна реакция.
        </Typography>
      </div>
      <div
        className="w-full md:w-80 text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
        data-aos="fade-up"
        data-aos-duration="1500"
        data-aos-delay="900"
      >
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 p-2 text-center shadow-lg">
          <FingerPrintIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          variant="h3"
          className="mb-3 font-bold text-gray-800 text-xl"
        >
          Юридическата част
        </Typography>
        <Typography className="text-gray-600 leading-relaxed">
          При некоректни съседи, при проблеми с ток, вода и парно, при решаване на съседски конфликти, при предявяване на гаранционни претенции, нашият юридически екип от правоспособни юристи и медиатори е на ваше разположение, за да свърши нещата докрай.
        </Typography>
      </div>
    </div>
    <div className="mt-12 text-center">
      <Button variant="filled" className="mx-auto">
        Вземи оферта
      </Button>
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

export default Services;
