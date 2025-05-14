import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; // Firebase auth import
import { signOut } from 'firebase/auth';
import { Avatar, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { useAuthState } from 'react-firebase-hooks/auth'; // Hook to get auth state
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; // For hamburger and close icons

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false); // State to track navbar open/close
  const [isServicesOpen, setIsServicesOpen] = useState(false); // State to track services dropdown open/close
  const navigate = useNavigate();
  const [user] = useAuthState(auth); // Get current user
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login'); // Redirect to login after sign-out
  };

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Close the navbar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNavOpen(false); // Close the navbar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to toggle the sliding menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle the state of the nav
  };

  // Toggle services dropdown in mobile view
  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-[#121d3b] to-[#2b193f] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="text-2xl font-semibold text-white hover:text-gray-300" to="/home">
          Вход Корект
        </Link>

        {/* Hamburger Menu Icon - Visible on small screens */}
        <div className="md:hidden">
          <Bars3Icon
            className="h-8 w-8 text-white cursor-pointer"
            onClick={toggleNav} // Toggle sliding navbar on click
          />
        </div>

        {/* Regular navbar links (hidden on mobile) */}
        <ul className="hidden md:flex space-x-8 items-center">
          <li>
            <Link className="text-white hover:text-gray-300" to="/home">
              За нас
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" to="/blog">
              Блог
            </Link>
          </li>
          <li className="relative">
            <button
              className={`text-white hover:text-gray-300 flex items-center ${anchorEl ? 'text-gray-300' : ''}`}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              Услуги
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
                Професионален домоуправител
              </Link>
              <Link
                onClick={handleClose}
                to="/services/service2"
                className="block px-4 py-2 text-[#121d3b] hover:bg-gray-100"
              >
                За кого е услугата
              </Link>
              <Link
                onClick={handleClose}
                to="/services/service3"
                className="block px-4 py-2 text-[#121d3b] hover:bg-gray-100"
              >
                Допълнителни услуги
              </Link>
            </div>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" to="/contact">
              Контакти
            </Link>
          </li>
          {/* User Avatar and Dropdown */}
          {user ? (
            <Menu>
              <MenuHandler>
                <Avatar
                  src="https://ui-avatars.com/api/?name=User"
                  className="cursor-pointer rounded-full"
                  alt="user"
                  size="xs"
                />
              </MenuHandler>
              <MenuList>
                <MenuItem className="text-gray-700 font-semibold">
                  Здравей, {user.displayName || user.email}
                </MenuItem>
                <hr className="my-1" />
                <MenuItem onClick={() => navigate('/profile')}>Профил</MenuItem>
                <MenuItem onClick={handleLogout}>Излизане</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition" to="/login">
              Влезни в акаунта си
            </Link>
          )}
        </ul>

        {/* Sliding navbar - for mobile view */}
        <div
          ref={dropdownRef}
          className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-[#121d3b] to-[#2b193f] text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isNavOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Меню</h2>
            <XMarkIcon className="h-8 w-8 cursor-pointer" onClick={toggleNav} />
          </div>

          <ul className="space-y-4 p-4">
            <li>
              <Link className="block text-white hover:text-gray-300" to="/home" onClick={toggleNav}>
                За нас
              </Link>
            </li>
            <li>
              <Link className="block text-white hover:text-gray-300" to="/blog" onClick={toggleNav}>
                Блог
              </Link>
            </li>
            <li>
              <button
                className="text-white flex justify-between items-center w-full"
                onClick={toggleServices}
              >
                Услуги
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
              {isServicesOpen && (
                <ul className="pl-4 mt-2 space-y-2">
                  <li>
                    <Link
                      className="block text-white hover:text-gray-300"
                      to="/services/service1"
                      onClick={toggleNav}
                    >
                      Професионален домоуправител
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block text-white hover:text-gray-300"
                      to="/services/service2"
                      onClick={toggleNav}
                    >
                      За кого е услугата
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block text-white hover:text-gray-300"
                      to="/services/service3"
                      onClick={toggleNav}
                    >
                      Допълнителни услуги
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link className="block text-white hover:text-gray-300" to="/contact" onClick={toggleNav}>
                Контакти
              </Link>
            </li>
            {/* Services dropdown in mobile */}
            {user ? (
              <>
                <li>
                  <Link className="block text-white hover:text-gray-300" to="/profile" onClick={toggleNav}>
                    Профил
                  </Link>
                </li>
                <li>
                  <button className="block text-white hover:text-gray-300 w-full text-left" onClick={handleLogout}>
                    Излизане
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  className="block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                  to="/login"
                  onClick={toggleNav}
                >
                  Влезни в акаунта си
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
