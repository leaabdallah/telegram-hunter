// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logo from "../assets/CALogo.png";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Simulate backend API
    const availableEmails = ["admin@example.com", "user@example.com"];
    if (availableEmails.includes(email.toLowerCase())) {
      toast.success("If this email exists, a reset link has been sent.");
      console.log("Reset password for:", email);
    } else {
      toast.error("Email not found.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Left side: Logo and welcome text */}
      <div className="flex-1 bg-gray-800 flex flex-col justify-center items-center p-8">
        <img src={logo} alt="Logo" className="mb-6 w-32 h-32" />
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome to Telegram Hunter
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-xs">
          Protect your digital assets with real-time threat monitoring.
        </p>
      </div>

      {/* Right side: Forgot Password form */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">
            Forgot Password
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Enter your email to receive a password reset link
          </p>

          <form onSubmit={handleReset} className="space-y-5" noValidate>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <EnvelopeIcon className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold text-white !bg-teal-500 hover:bg-blue-700 transition"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            <span
              className="text-teal-400 hover:text-teal-300 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
