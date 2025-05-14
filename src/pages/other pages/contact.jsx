import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Footer } from '@/widgets/layout';
import AOS from "aos";
import "aos/dist/aos.css";
import { FormControl, Select, MenuItem } from "@mui/material";
import { doc, collection, setDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../../firebase/firebase"; // Import Firestore instance
import { PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import logo from "../../img/1-removebg-preview.png";

export function ContactForm() {
  useEffect(() => {
    AOS.init();
  }, []);

  const [city, setCity] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a new document reference for the "suobshtenia" collection
      const messageRef = doc(collection(db, 'suobshtenia'));
      console.log("test 1", messageRef);
      
      // Create the form data to save
      const messageData = {
        name,
        email,
        city,
        message,
        createdAt: new Date(), // Timestamp of submission
      };
      console.log("test 2", messageData);
      // Save the form data to Firestore
      await setDoc(messageRef, messageData);
      // Success message and reset form fields
      alert("Message sent successfully!");
      setName('');
      setEmail('');
      setCity('');
      setMessage('');

    } catch (error) {
      console.error('Error sending message: ', error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section with Logo */}
      <div className="mt-16">
        <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-center">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center opacity-40" />
          <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
          <div className="relative container mx-auto px-4 py-16 lg:py-32">
            <img src={logo} alt="Logo" className="mx-auto mb-6 w-84 h-72" data-aos="fade-up" data-aos-duration="1500" />
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
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-gray-700">Име</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        placeholder="Вашето име"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Имейл</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        placeholder="Вашият имейл"
                        required
                      />
                    </div>
                    <FormControl className="w-full">
                      <label className="block text-gray-700">Град</label>
                      <Select
                        value={city}
                        onChange={handleChange}
                        displayEmpty
                        className="w-full px-4 py-0 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        <MenuItem value={"Перник"}>Перник</MenuItem>
                        <MenuItem value={"София"}>София</MenuItem>
                        <MenuItem value={"Радомир"}>Радомир</MenuItem>
                      </Select>
                    </FormControl>

                    <div>
                      <label className="block text-gray-700">Съобщение</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-purple-300"
                        placeholder="Вашето Съобщение"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className={`w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Изпращане...' : 'Изпратете съобщение'}
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
                      гр.Перник, ул.'Димитър Благоев'44
                    </Typography>
                  </CardBody>
                </Card>
                <Card className="shadow-lg">
                  <CardBody className="flex items-center">
                    <PhoneIcon className="w-6 h-6 text-purple-500" />
                    <Typography variant="h6" color="gray" className="ml-4">
                      +359 88 6459 652
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
        <div className="bg-white">
          <Footer />
        </div>
      </div>
    </>
  );
}
