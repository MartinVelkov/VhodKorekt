import React, { useEffect } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";

export function ContactForm() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      {/* Hero Section with Logo */}
      <div className="mt-16">
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4 py-16 lg:py-32">
            <img src="/img/logo.png" alt="Logo" className="mx-auto mb-6 w-24 h-24" data-aos="fade-up" data-aos-duration="1500" />
            <Typography
              variant="h1"
              color="white"
              className="mb-6 font-bold text-3xl sm:text-4xl lg:text-5xl"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              Свържете се с нас
            </Typography>
          </div>
        </div>

        {/* Contact Form and Info Section */}
        <section className="-mt-32 bg-white px-4 pb-20 pt-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {/* Contact Form */}
              <Card className="shadow-lg" data-aos="fade-up" data-aos-duration="1500">
                <CardBody>
                  <Typography variant="h5" color="gray" className="mb-4">
                    Изпратете съобщение
                  </Typography>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700">Име</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        placeholder="Вашето име"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Имейл</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        placeholder="Вашият имейл"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Съобщение</label>
                      <textarea
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        placeholder="Вашето Съобщение"
                        rows="4"
                      ></textarea>
                    </div>
                    <button
                      className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      Send Message
                    </button>

                  </form>
                </CardBody>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6" data-aos="fade-up" data-aos-duration="1500" data-aos-delay="300">
                <Card className="shadow-lg">
                  <CardBody className="flex items-center">
                    <PhoneIcon className="w-6 h-6 text-purple-500" />
                    <Typography variant="h6" color="gray" className="ml-4">
                      +359 89 960 8064
                    </Typography>
                  </CardBody>
                </Card>
                <Card className="shadow-lg">
                  <CardBody className="flex items-center">
                    <PhoneIcon className="w-6 h-6 text-purple-500" />
                    <Typography variant="h6" color="gray" className="ml-4">
                      +359 88 645 9652
                    </Typography>
                  </CardBody>
                </Card>
                <Card className="shadow-lg">
                  <CardBody className="flex items-center">
                    <EnvelopeIcon className="w-6 h-6 text-purple-500" />
                    <Typography variant="h6" color="gray" className="ml-4">
                      vhod.korekt@gmail.com
                    </Typography>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ContactForm;
