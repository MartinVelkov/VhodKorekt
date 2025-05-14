import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './navbar/navbar';
import { Home, BlogPage, BlogDetailPage, ServiceOne, ServiceTwo, ServiceThree, NotFound, ContactForm, Login, Register, CheckMyHome} from './pages';
import { BlogPageOne } from "./pages/blogs/index";
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/1" element={<BlogPageOne />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/services/service1" element={<ServiceOne />} />
        <Route path="/services/service2" element={<ServiceTwo />} />
        <Route path="/services/service3" element={<ServiceThree />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<CheckMyHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;