import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { saveUserToFirestore } from "../utils/saveUser";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

function FireBaseLogin() {
  const navigate = useNavigate();

  // 🔹 OTP states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  // 🔹 Google Login
 const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    // 1️⃣ Firebase authenticates user
    const result = await signInWithPopup(auth, provider);

    // 2️⃣ 🔥 SAVE USER HERE (THIS IS THE ANSWER)
    await saveUserToFirestore(result.user);

    // 3️⃣ Optional log
    console.log("Google User:", result.user);

    // 4️⃣ Then navigate
    navigate("/signup");
  } catch (error) {
    console.error(error);
  }
};

  // 🔹 Send OTP
  const sendOtp = async () => {
    try {
      if (!phone.startsWith("+")) {
        alert("Phone number must include country code (e.g. +91)");
        return;
      }

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );

      setConfirmation(confirmationResult);
      alert("OTP sent successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
  };

  // 🔹 Verify OTP
  const verifyOtp = async () => {
  try {
    // Firebase verifies OTP and returns user
    const result = await confirmation.confirm(otp);

    // 🔥 SAVE USER HERE
    await saveUserToFirestore(result.user);

    alert("OTP verified, login successful");
    navigate("/signup");
  } catch (error) {
    console.error(error);
    alert("Invalid OTP");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200">

        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          RentEasy
        </h2>

        {/* 🔹 Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg font-medium transition-all mb-6"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-500 mb-4">OR</p>

        {/* 🔹 Phone OTP */}
        <input
          type="text"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />

        <button
          onClick={sendOtp}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-xl mb-4"
        >
          Send OTP
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <button
          onClick={verifyOtp}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
        >
          Verify OTP
        </button>

        {/* 🔹 reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default FireBaseLogin;
