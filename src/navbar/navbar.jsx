import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dropdownRef = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#121d3b] to-[#2b193f] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="text-2xl font-semibold text-white hover:text-gray-300" to="/home">
          Вход Корект
        </Link>
        <ul className="flex space-x-8">
          <li>
            <Link className="text-white hover:text-gray-300" to="/home">
              За нас
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" to="/blog">
              блог
            </Link>
          </li>
          <li className="relative">
            <button
              className={`text-white hover:text-gray-300 flex items-center ${anchorEl ? 'text-gray-300' : ''}`}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              услуги
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              ref={dropdownRef}
              id="simple-menu"
              className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-20 transition-transform transform ${
                anchorEl ? 'scale-100' : 'scale-0'
              }`}
            >
              <Link
                onClick={handleClose}
                to="/services/service1"
                className="block px-4 py-2 text-[#121d3b] hover:bg-gray-100"
              >
                Service 1
              </Link>
              <Link
                onClick={handleClose}
                to="/services/service2"
                className="block px-4 py-2 text-[#121d3b] hover:bg-gray-100"
              >
                Service 2
              </Link>
              <Link
                onClick={handleClose}
                to="/services/service3"
                className="block px-4 py-2 text-[#121d3b] hover:bg-gray-100"
              >
                Service 3
              </Link>
            </div>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" to="/contact">
              контакти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
