import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography } from '@material-tailwind/react';
import logo from "../../img/1-removebg-preview.png";
import GoogleSignInButton from '../../widgets/Components/googleAuthButton';

import '../pagesCSS/stylesheet.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  // Handle screen size change
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError('Невалиден имейл или парола');
    }
  };

  // Desktop View (Large screens)
  const renderDesktopView = () => (
    <div className="flex min-h-screen">
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-12">
        <div className="text-center">
          <Typography variant="h1" className="text-4xl font-bold text-gray-800 mb-4">
            Здравейте отново!
          </Typography>
          <div className="mt-6">
            <img src={logo} alt="logo" className="mx-auto w-80" />
          </div>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <Typography variant="h2" className="text-center text-gray-800 mb-4">
            Влез
          </Typography>
          <Typography className="text-center text-sm text-gray-500 mb-6">
            Нямаш акаунт?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Да започваме
            </a>
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Имейл адрес</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
                className="w-full border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Парола</label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                className="w-full border-gray-300 rounded-md"
                required
              />
              <div className="text-right mt-2">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Забравена парола?
                </a>
              </div>
            </div>

            {error && <Typography color="red" className="text-center">{error}</Typography>}

            <Button type="submit" fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-3">
              Влез
            </Button>
          </form>

          <div className="text-center my-4 text-gray-500">ИЛИ</div>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );

  // Mobile View (Small screens)
  const renderMobileView = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-md">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-20" />
        </div>
        <Typography variant="h4" color="blue-gray" className="text-center">
          Вход
        </Typography>
        <Typography color="gray" className="mt-1 font-normal text-center">
          Добре дошли! Въведете данните си за вход.
        </Typography>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Typography variant="h6" color="blue-gray">
              Вашият имейл
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>
          <div>
            <Typography variant="h6" color="blue-gray">
              Парола
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>

          {error && <Typography color="red" className="text-center">{error}</Typography>}

          <Button type="submit" className="mt-6 text-gray-600" fullWidth>
            Вход
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Typography className="text-sm text-gray-600">
            Или влезте с
          </Typography>
          <GoogleSignInButton />
        </div>

        <Typography color="gray" className="mt-4 text-center font-normal">
          Нямате акаунт?{' '}
          <a href="/register" className="font-medium text-gray-900">
            Регистрация
          </a>
        </Typography>
      </Card>
    </div>
  );

  return isSmallScreen ? renderMobileView() : renderDesktopView();
}
