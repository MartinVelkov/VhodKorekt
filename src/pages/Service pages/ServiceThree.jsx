const services = [
  {
    title: "Почистване",
    description: "Образцов вход предлага за своите клиенти услуги по специализирано почистване на жилищни сгради и комплекси от затворен тип. Дружеството разполага с квалифициран и обучен екип от хигиенисти, специализирана почистваща техника и вътрешна система за контрол на качеството.",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
    buttonText: "Потърсете ни сега",
  },
  {
    title: "Дезинфекция, дезинсекция, дератизация",
    description: "В Образцов вход имаме богат опит в борбата с вредители, дезинсекцията срещу кърлежи и комари, както и в намаляването на гризачите в канализационните мрежи. Фокусирани сме върху внедряване на системи за контрол на вредителите, като поставяме акцент върху ограничаване до минимум на използваните биоциди.",
    buttonClass: "bg-purple-600 hover:bg-purple-700",
    buttonText: "Потърсете ни сега",
  },
  {
    title: "Озеленяване",
    description: "Образцов вход ООД е вашето решение за поддръжка на зелени площи. Ние предлагаме както еднократни услуги, така и абонаменти за задължителната поддръжка през целия сезон. Нашият екип ще направи предварителен оглед на пространството и ще се консултира с вас относно специфичните изисквания.",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700",
    buttonText: "Потърсете ни сега",
  },
  {
    title: "Разкриване на самостоятелни партиди към ЧЕЗ, Софийска вода и Топлофикация София",
    description: "Образцов Вход ООД предлага цялостно съдействие и организация на процедура по разкриване на самостоятелни партиди към комуналните дружества. Услугата е подходяща за инвеститори и строители на жилищни кооперации, както и за собственици в новопостроени сгради.",
    buttonClass: "bg-teal-600 hover:bg-teal-700",
    buttonText: "Потърсете ни сега",
  },
];

import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import AOS from "aos";
import { Footer } from '@/widgets/layout';
import "aos/dist/aos.css";

const initializeAnimations = () => {
  AOS.init({ duration: 1500, easing: "ease-in-out", once: true });
};

const ServiceConnector = ({ isLast }) => !isLast && (
  <div className="relative py-8 flex justify-center" data-aos="fade-up">
    <div className="h-px w-32 bg-gray-300 relative">
      <div className="absolute -left-2 -top-2.5 w-5 h-5 bg-purple-500 rounded-full" />
      <div className="absolute -right-2 -top-2.5 w-5 h-5 bg-blue-500 rounded-full" />
    </div>
  </div>
);

const ServiceCard = ({ service, index }) => (
  <div className="relative" data-aos="fade-up">
    <div className="relative z-10 max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-lg text-center border border-gray-100">
      <Typography variant="h4" className="font-bold text-2xl lg:text-3xl mb-6 text-gray-900">
        {service.title}
      </Typography>
      <Typography variant="body1" className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8 px-4">
        {service.description}
      </Typography>
      <div className="flex justify-center">
        <Button
          className={`px-8 py-3 text-lg rounded-full ${service.buttonClass} text-white shadow-lg transition-all duration-300 transform hover:scale-105`}
        >
          {service.buttonText}
        </Button>
      </div>
    </div>
  </div>
);

const ServiceHero = () => (
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
          Допълнителни Услуги
        </Typography>
      </div>
    </div>
  </div>
);

export function ServiceThree() {
  React.useEffect(initializeAnimations, []);

  return (
    <div className="bg-gray-50">
      <ServiceHero />

      <div className="py-20">
        <div className="container mx-auto space-y-16">
          {services.map((service, index) => (
            <div key={index}>
              <ServiceCard service={service} index={index} />
              <ServiceConnector isLast={index === services.length - 1} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}

export default ServiceThree;