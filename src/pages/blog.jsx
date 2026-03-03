import React from "react";
import {
  Typography,
} from "@material-tailwind/react";
import { Footer } from "@/widgets/layout";

export function Blog() {
  return (
    <>
      <div className="mt-16">
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center py-16 lg:py-32">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-bold text-3xl sm:text-4xl lg:text-5xl"
              >
                Блог
              </Typography>
              <Typography
                variant="lead"
                color="white"
                className="opacity-90 text-lg sm:text-xl lg:text-2xl max-w-3xl"
              >
                Това е мястото, в което ще държим всички на линия с актуални промени и информация.
              </Typography>
            </div>
          </div>
        </div>
        <div className="bg-white">
          <div className="container mx-auto py-12 px-4">
            <Typography variant="h2" color="gray-800" className="text-center mb-6 font-bold text-2xl lg:text-3xl">
              Последни Статии
            </Typography>
            <div className="flex flex-wrap -mx-4">
              <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                <div className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Typography variant="h5" color="gray-800" className="mb-2 font-semibold">
                    Заглавие на статия
                  </Typography>
                  <Typography variant="paragraph" color="gray-600" className="mb-4">
                    Кратко резюме на статията, която предоставя информация за съдържанието и основните точки на интерес.
                  </Typography>
                  <a href="#" className="text-blue-500 hover:text-blue-700 font-medium">
                    Прочети повече
                  </a>
                </div>
              </div>
              {/* Repeat the above block for more articles */}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Blog;
