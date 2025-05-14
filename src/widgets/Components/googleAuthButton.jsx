import React, { useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from '../../firebase/firebase'; // Assuming Firebase is configured here
import { useNavigate } from 'react-router-dom';

const GoogleSignInButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to load the Google Identity Services script
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn; // Call the init function after the script loads
      document.body.appendChild(script);
    };

    // Initialize the Google Sign-In button after the script is loaded
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "915338230289-2dov40g4thgsnv0d5so2rg0mvp6lo3kk.apps.googleusercontent.com", // Replace with your actual Google Client ID
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"), // Target element for the button
          {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );

        window.google.accounts.id.prompt(); // Automatically prompt the user for Google Sign-In
      } else {
        console.error("Google API script not loaded properly");
      }
    };

    // Load the Google script dynamically
    loadGoogleScript();
  }, []);

  const handleCredentialResponse = async (response) => {
    const credential = response.credential; // The JWT token received from Google

    // Create a Google credential with the token
    const googleProvider = new GoogleAuthProvider();
    const googleCredential = GoogleAuthProvider.credential(credential);

    try {
      // Sign in with the Google credential in Firebase
      await signInWithCredential(auth, googleCredential);
      // Redirect to home on successful sign-in
      navigate("/home");
    } catch (error) {
      console.error("Error during Google Sign-In: ", error);
      alert("Failed to sign in with Google");
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div id="google-signin-btn"></div> {/* Google Sign-In button rendered here */}
    </div>
  );
};

export default GoogleSignInButton;
