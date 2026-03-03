import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import "aos/dist/aos.css";
import AOS from "aos";

export function ServiceThree() {
  React.useEffect(() => {
    AOS.init({ duration: 1500, easing: "ease-in-out", once: true });
  }, []);

  const services = [
    {
      title: "Почистване",
      description:
        "Образцов вход предлага за своите клиенти услуги по специализирано почистване на жилищни сгради и комплекси от затворен тип. Дружеството разполага с квалифициран и обучен екип от хигиенисти, специализирана почистваща техника и вътрешна система за контрол на качеството.",
      buttonColor: "blue",
      backgroundImage: "/img/cleaning-bg.jpg",
      buttonText: "Потърсете ни сега",
    },
    {
      title: "Дезинфекция, дезинсекция, дератизация",
      description:
        "В Образцов вход имаме богат опит в борбата с вредители, дезинсекцията срещу кърлежи и комари, както и в намаляването на гризачите в канализационните мрежи. Фокусирани сме върху внедряване на системи за контрол на вредителите, като поставяме акцент върху ограничаване до минимум на използваните биоциди.",
      buttonColor: "purple",
      backgroundImage: "/img/disinfection-bg.jpg",
      buttonText: "Потърсете ни сега",
    },
    {
      title: "Озеленяване",
      description:
        "Образцов вход ООД е вашето решение за поддръжка на зелени площи. Ние предлагаме както еднократни услуги, така и абонаменти за задължителната поддръжка през целия сезон. Нашият екип ще направи предварителен оглед на пространството и ще се консултира с вас относно специфичните изисквания.",
      buttonColor: "indigo",
      backgroundImage: "/img/gardening-bg.jpg",
      buttonText: "Потърсете ни сега",
    },
    {
      title: "Разкриване на самостоятелни партиди към ЧЕЗ, Софийска вода и Топлофикация София",
      description:
        "Образцов Вход ООД предлага цялостно съдействие и организация на процедура по разкриване на самостоятелни партиди към комуналните дружества. Услугата е подходяща за инвеститори и строители на жилищни кооперации, както и за собственици в новопостроени сгради.",
      buttonColor: "teal",
      backgroundImage: "/img/utilities-bg.jpg",
      buttonText: "Потърсете ни сега",
    },
  ];

  return (
    <div className="mt-16">
      {/* Hero Section */}
      <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-center overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-30" />
        <div className="absolute top-0 left-0 h-full w-full bg-black/50" />
        <div className="relative container mx-auto px-4 py-16 lg:py-32">
          <Typography
            variant="h1"
            color="white"
            className="mb-6 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-widest drop-shadow-lg"
            data-aos="zoom-in"
          >
            Допълнителни услуги
          </Typography>
        </div>
      </div>

      {/* Service Sections */}
      {services.map((service, index) => (
        <div
          key={index}
          className="relative py-20 flex flex-col items-center justify-center text-center px-4 lg:px-20"
          style={{
            backgroundImage: `url(${service.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          data-aos="fade-up"
        >
          <div className="absolute top-0 left-0 h-full w-full bg-black/40" />
          <div className="relative z-10 max-w-4xl">
            <Typography variant="h4" color="white" className="font-bold text-3xl lg:text-4xl mb-6">
              {service.title}
            </Typography>
            <Typography variant="body1" color="white" className="text-lg lg:text-xl leading-relaxed mb-8">
              {service.description}
            </Typography>
            <Button
              className={`px-10 py-4 text-lg rounded-full bg-${service.buttonColor}-600 hover:bg-${service.buttonColor}-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              {service.buttonText}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServiceThree;
