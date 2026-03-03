import React from "react";
import { FeatureCard } from "@/widgets/cards";
import { featuresData } from "@/data";
import {
  Typography,
} from "@material-tailwind/react";

export function ServiceTwo() {
  return (
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
              Ние сме малка компания коертвергверг дфг ер гвег дфг вергс дфгвер
              гдфг сдфгв ергдфгсер вег сдфг верг дфгсдгер ге гсдфг вергс дфгвер
              гд фгсергв ерг сергсе ргс р дерррррррррррррррррррррре сг ер ге с
              ер г сер г серг с ерг с ер г сер гс
            </Typography>
        </div>
        {/* Features Section */}
        
      </div>
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
                  photo={
                    <img
                      src={photo}
                      alt={title}
                      className="w-full h-40 object-cover"
                    />
                  }
                  className="transition-transform duration-300 hover:scale-105"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                />
              ))}
            </div>
          </div>
        </section>
     </div> 
  );
}

export default ServiceTwo;
