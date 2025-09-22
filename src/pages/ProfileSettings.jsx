// src/pages/Settings.jsx
import { useState, useEffect } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) setDarkMode(JSON.parse(saved));
  }, []);

  const handleToggle = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", JSON.stringify(!darkMode));
  };

  return (
    <div className="bg-slate-900 p-6 rounded-lg shadow-md text-white max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="flex items-center justify-between mb-4">
        <span>Dark Mode</span>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={handleToggle}
          className="accent-teal-500"
        />
      </div>

      <p className="text-gray-400 text-sm">
        Toggle dark mode for the application interface.
      </p>
    </div>
  );
};

export default Settings;
