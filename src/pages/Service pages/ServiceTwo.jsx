import React from "react";
import { FeatureCard } from "@/widgets/cards";
import { featuresData } from "@/data";
import { Typography } from "@material-tailwind/react";
import { Footer } from '@/widgets/layout';

export function ServiceTwo() {
  return (
    <div className="mt-16">
      {/* Background Section */}
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
            Ние сме малка компания, която вярва, че персонализираният подход е ключът към дългосрочни взаимоотношения. Фокусираме се върху иновациите и креативните решения. Всеки проект за нас е възможност да докажем качеството си на работа. 
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
                // Dynamically render icon using React.createElement
                icon={React.createElement(icon, {
                  className: "w-6 h-6 text-white", // Adjust the icon size and color
                })}
                // Pass the photo string directly to img src
                photo={photo} // Correctly pass photo as string
                className="transition-transform duration-300 hover:scale-105"
                data-aos="fade-up"
                data-aos-duration="1500"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <div className="bg-white">
        <Footer />
      </div>
    </div>
  );
}
