import React from "react";
import {
  Card,
  Typography,
  Button,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon } from "@heroicons/react/24/solid";
import { Footer } from "@/widgets/layout";
import AOS from "aos";

export function Home() {
  React.useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className='mt-16'>
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4 py-16 lg:py-32">
            <Typography
              variant="h1"
              color="white"
              className="mb-6 font-bold text-3xl sm:text-4xl lg:text-5xl animate__animated animate__fadeIn"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              Нашата История
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="opacity-90 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto animate__animated animate__fadeIn"
              data-aos="fade-up"
              data-aos-duration="2000"
              data-aos-delay="300"
            >
              Ние сме малка компания коертвергверг дфг ер гвег дфг вергс дфгвер
              гдфг сдфгв ергдфгсер вег сдфг верг дфгсдгер ге гсдфг вергс дфгвер гд
              фгсергв ерг сергсе ргс р деррррррррррррррррррррр ре сг ер ге с ер г
              сер г серг с ерг с ер г сер гс
            </Typography>
          </div>
        </div>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto">
            <div className="flex flex-wrap justify-center gap-8">
              <Typography variant="h3" className="mb-3 font-bold text-gray-800">
                Повече за професионаленонален домоуправител Образцов Вход
              </Typography>
              <Typography className="font-normal text-gray-600">
                Образцов вход е компания за компетентно управление на сгради,
                които са в режим на етажна собственост, както и затворени
                комплекси. Основахме семейната ни фирма преди осем години с фокус
                върху управлението и поддръжката на разнообразен по мащаб жилищен
                фонд. Ние сме професионален домоуправител на жилищни сгради, а
                също и комплекси, изградени с иновативни материали и съвременни
                технологии, които предлагат много високо качество. Компанията е
                двигател и иноватор в областта на развитието на сектора на
                професионалното управление на етажна собственост в страната.
                Търсите надежден и доказан партньор, на който да поверите грижата
                за недвижимото си имущество? Свържете се с нас още днес!
              </Typography>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <div className="bg-white">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Home;
