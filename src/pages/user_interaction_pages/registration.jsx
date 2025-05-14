import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase'; // Import Firestore (db)
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from '@material-tailwind/react';
import logo from "../../img/1-removebg-preview.png";
import GoogleSignInButton from '../../widgets/Components/googleAuthButton';
import '../pagesCSS/stylesheet.css';

// Function to generate a unique subscription number based on address
function generateCode(city, neighborhood, block, apartment) {
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit
    }
    return Math.abs(hash); // Return positive values
  }

  let cityCodePrefix;
  switch (city.toLowerCase()) {
    case 'софия':
      cityCodePrefix = 1;
      break;
    case 'перник':
      cityCodePrefix = 2;
      break;
    case 'варна':
      cityCodePrefix = 3;
      break;
    case 'бургас':
      cityCodePrefix = 4;
      break;
    default:
      cityCodePrefix = 9;
      break;
  }

  const neighborhoodCode = hashString(neighborhood) % 1000;
  const blockCode = hashString(block.toString()) % 100;
  const apartmentCode = hashString(apartment.toString()) % 100;

  return `${cityCodePrefix}${neighborhoodCode}${blockCode}${apartmentCode}`;
}

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [block, setBlock] = useState('');
  const [apartment, setApartment] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentSource, setPaymentSource] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    checkScreenWidth(); // Initial check
    window.addEventListener('resize', checkScreenWidth);
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const subscriberNumber = generateCode(city, neighborhood, block, apartment);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'clienti', user.uid), {
        email,
        subscriberNumber,
        invoiceNumber,
        paymentSource,
        createdAt: new Date().toISOString(),
      });

      navigate('/home');
    } catch (error) {
      setError('Error creating account. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  function desktopView() {
    return (
      <div className="flex min-h-screen">
        {/* Left Section with Personalized Greeting */}
        <div className="w-1/2 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-12">
          <div className="text-center">
            <Typography variant="h1" className="text-4xl font-bold text-gray-800 mb-4">
              Добре дошли!
            </Typography>
            <div className="mt-6">
              <img src={logo} alt="logo" className="mx-auto w-80" />
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="max-w-md w-full p-6">
            <Typography variant="h2" className="text-center text-gray-800 mb-4">
              Създай акаунт
            </Typography>
            <Typography className="text-center text-sm text-gray-500 mb-6">
              Вече имаш акаунт?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Влез в акаунта
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
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="block text-gray-700">Парола</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  className="w-full border-gray-300 rounded-md"
                  placeholder="Въведете парола"
                />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Град</label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    size="lg"
                    className="w-full border-gray-300 rounded-md"
                    placeholder="Въведете град"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Квартал</label>
                  <Input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    size="lg"
                    className="w-full border-gray-300 rounded-md"
                    placeholder="Въведете квартал"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Блок</label>
                  <Input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    size="lg"
                    className="w-full border-gray-300 rounded-md"
                    placeholder="Въведете блок"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Апартамент</label>
                  <Input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    size="lg"
                    className="w-full border-gray-300 rounded-md"
                    placeholder="Въведете апартамент"
                  />
                </div>
              </div>

              {error && (
                <Typography color="red" className="text-center">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-3"
              >
                {loading ? 'Регистриране...' : 'Регистрирай се'}
              </Button>
            </form>

            <div className="text-center my-4 text-gray-500">Или</div>

            <div className="flex justify-center space-x-4">
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function mobileView() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-md">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="h-20" />
          </div>
          <Typography variant="h4" color="blue-gray" className="text-center mb-2">
            Регистрация
          </Typography>
          <Typography color="gray" className="text-center mb-6">
            Създайте акаунт и се присъединете към нас!
          </Typography>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Вашият имейл"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
              />
              <Input
                type="password"
                placeholder="Вашата парола"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Град"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                size="lg"
              />
              <Input
                type="text"
                placeholder="Квартал"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                size="lg"
              />
              <Input
                type="text"
                placeholder="Блок"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                size="lg"
              />
              <Input
                type="text"
                placeholder="Апартамент"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                size="lg"
              />
            </div>

            {error && (
              <Typography color="red" className="text-center">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-3"
            >
              {loading ? 'Регистриране...' : 'Регистрирай се'}
            </Button>
          </form>

          <div className="text-center mt-4">Или</div>

          <div className="flex justify-center mt-2">
              <GoogleSignInButton />
          </div>
           <Typography color="gray" className="mt-4 text-center font-normal">
                    Имате акаунт?{' '}
                    <a href="/login" className="font-medium text-gray-900">
                      Вход
                    </a>
                  </Typography>
        </div>
      </div>
    );
  }

  return isSmallScreen ? mobileView() : desktopView();
}
