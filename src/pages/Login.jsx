// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/CALogo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [rememberMe, setRememberMe] = useState(false);

  // Load Remember Me state and saved username
  useEffect(() => {
    const savedRemember = localStorage.getItem("rememberMe") === "true";
    const savedUsername = localStorage.getItem("rememberedUsername") || "";
    setRememberMe(savedRemember);
    if (savedRemember) setUsername(savedUsername);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!username || !password) return;

    setIsLoading(true);

    // Fake login logic
    setTimeout(() => {
      if (password === "hunter123") {
        const role = username === "admin" ? "admin" : "user";
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify({ username, role }));

        // Save Remember Me preference
        localStorage.setItem("rememberMe", rememberMe);
        if (rememberMe) localStorage.setItem("rememberedUsername", username);
        else localStorage.removeItem("rememberedUsername");

        setIsSuccess(true);
      } else {
        alert("Invalid credentials");
      }
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (isSuccess) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Left side */}
      <div className="flex-1 bg-gray-800 flex flex-col justify-center items-center p-8">
        <img src={logo} alt="Logo" className="mb-6 w-32 h-32" />{" "}
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome to Telegram Hunter
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-xs">
          Protect your digital assets with real-time threat monitoring.
        </p>
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-10 transform transition-all duration-500 hover:scale-105">
          <h1 className="text-3xl font-bold mb-2 text-center text-white">
            Welcome Back
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-200">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <UserIcon className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched({ ...touched, username: true })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
              {touched.username && !username && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter username
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 font-medium text-gray-200">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <LockClosedIcon className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                  onBlur={() => setTouched({ ...touched, password: true })}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 cursor-pointer select-none"
                >
                  {showPassword ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5" />
                  )}
                </span>
              </div>
              {touched.password && !password && (
                <p className="text-red-500 text-sm mt-1">
                  Please enter password
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-teal-500"
                />
                <span className="text-gray-200">Remember me</span>
              </label>
              <span
                className="text-teal-400 hover:text-teal-300 cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition
                ${
                  isLoading
                    ? "!bg-teal-600 cursor-not-allowed"
                    : "!bg-teal-500 hover:bg-teal-600"
                }`}
            >
              {isLoading ? "Signing In..." : "Log In"}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 text-center text-gray-400 text-sm">
            Demo login:
            <div className="mt-1">
              <span className="font-medium">Admin:</span> admin / hunter123
            </div>
            <div>
              <span className="font-medium">User:</span> any / hunter123
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Telegram Hunter. All rights
            reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
