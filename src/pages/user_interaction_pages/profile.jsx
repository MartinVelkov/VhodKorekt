import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from '@material-tailwind/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Adjust the import path to your Firebase config

export function CheckMyHome() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fetch the password from Firestore
      const homeDocRef = doc(db, 'Clienti', 'profili'); // Replace 'home1' with your document ID
      console.log(1);
      
      const homeDocSnap = await getDoc(homeDocRef);
      console.log(2);
      if (homeDocSnap.exists()) {
        const storedPassword = homeDocSnap.data().code;
        console.log(3);
        // Compare the entered password with the stored password
        if (password === storedPassword) {
          console.log(4);
          navigate('/'); // Navigate to the home page if the password is correct
        } else {
          setError('Incorrect password. Please try again.');
        }
      } else {
        setError('Home document not found.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error fetching password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-2xl">
        <Typography variant="h2" className="text-center text-gray-800 mb-6">
          Check My Home
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-gray-700">Enter Home Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="lg"
              className="w-full border-gray-300 rounded-md"
              placeholder="Enter your home password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <Typography color="red" className="text-center">
              {error}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-3 transition duration-300"
          >
            {loading ? 'Checking...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}