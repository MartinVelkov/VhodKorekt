import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './navbar/navbar';
import { Home, Blog, ServiceOne, ServiceTwo, ServiceThree, NotFound, ContactForm } from './pages';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/services/service1" element={<ServiceOne />} />
        <Route path="/services/service2" element={<ServiceTwo />} />
        <Route path="/services/service3" element={<ServiceThree />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
