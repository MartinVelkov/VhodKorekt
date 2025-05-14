// src/pages/NotFound.js
import React from 'react';
import { Footer } from '@/widgets/layout';

export function  NotFound(){
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <div className="bg-white">
          <Footer />
      </div>
    </div>
  );
};

export default NotFound;
