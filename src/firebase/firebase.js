import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Firestore Database

const firebaseConfig = {
    apiKey: "AIzaSyAb3Z0RTFen3vK2RjGkOmRR-j5Pa0KN8XQ",
    authDomain: "fir-8685d.firebaseapp.com",
    projectId: "fir-8685d",
    storageBucket: "fir-8685d.firebasestorage.app",
    messagingSenderId: "53632831713",
    appId: "1:53632831713:web:8e9cd058936c8b29afe7a0",
    measurementId: "G-WJN4QY9XQR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);  // Firebase Auth
const db = getFirestore(app);  // Firestore DB

// Export the services to use in other parts of the app
export { auth, db };
