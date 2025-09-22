import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const pageTitles = {
  // User pages
  dashboard: "Dashboard",
  alerts: "Alerts",
  "leak-hunter": "Leak Hunter",
  settings: "Settings",
  profile: "Profile",
  "profile-settings": "Settings",

  // Admin pages
  admin: "Dashboard",
  "admin/users": "Users",
  "admin/clients": "Clients",
  "admin/LeakHunter": "Leak Hunter",
  "admin/logs": "Logs",
  "admin/alerts": "Alerts",
  "admin/settings": "Settings",
  "admin/profile": "Profile",
  "admin/profile-settings": "Settings",
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the current path and normalize for admin/user pages
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPath =
    pathSegments[0] === "admin"
      ? pathSegments.slice(0, 2).join("/") // admin pages: "admin/users"
      : pathSegments[0]; // user pages: "dashboard", "alerts", etc.

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        {/* Page title */}
        <div className="text-gray-200 text-sm font-semibold uppercase tracking-wider">
          {pageTitles[currentPath] || "Dashboard"}
        </div>

        {/* User icon */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-gray-600 transition"
            onClick={() => setOpen(!open)}
          >
            👤
          </div>

          {/* Dropdown with transition */}
          <div
            className={`absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-lg shadow-lg py-2 transform transition-all duration-200 ease-out origin-top-right
            ${
              open
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <span
              onClick={() => {
                const path = location.pathname.startsWith("/admin")
                  ? "/admin/profile"
                  : "/profile";
                navigate(path);
              }}
              className="block w-full text-left px-4 py-2 hover:!bg-gray-700 transition"
              style={{ backgroundColor: "transparent" }}
            >
              Profile
            </span>

            <span
              onClick={() =>
                location.pathname.startsWith("/admin")
                  ? navigate("/admin/profile-settings")
                  : navigate("/profile-settings")
              }
              className="block w-full text-left px-4 py-2 hover:!bg-gray-700 transition"
              style={{ backgroundColor: "transparent" }}
            >
              Settings
            </span>

            <span
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:!bg-gray-700 text-red-400 transition"
              style={{ backgroundColor: "transparent" }}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
