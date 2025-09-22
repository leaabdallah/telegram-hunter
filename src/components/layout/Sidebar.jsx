import {
  HomeIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const handleLogout = () => {
  localStorage.removeItem("auth");
  window.location.href = "/login";
};

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
  { name: "Alerts", path: "/alerts", icon: BellAlertIcon },
  { name: "Leak Hunter", path: "/leak-hunter", icon: MagnifyingGlassIcon },
  { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
  { name: "Logout", action: handleLogout, icon: ArrowRightOnRectangleIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("userSidebarCollapsed");
    return saved !== null ? JSON.parse(saved) : true; // default collapsed
  });

  // Save collapsed state
  useEffect(() => {
    localStorage.setItem("userSidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <aside
      className={`h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-lg font-bold">Threat Watch</h1>}
        {collapsed ? (
          <Bars3Icon
            className="w-6 h-6 cursor-pointer text-slate-300 hover:text-white transition"
            onClick={() => setCollapsed(!collapsed)}
          />
        ) : (
          <XMarkIcon
            className="w-6 h-6 cursor-pointer text-slate-300 hover:text-white transition"
            onClick={() => setCollapsed(!collapsed)}
          />
        )}
      </div>

      {/* Menu items */}
      <nav className="mt-4 flex flex-col" style={{ height: "100%" }}>
        <div>
          {navItems.map(({ name, path, icon: Icon, action }) => {
            const isActive = location.pathname === path;

            // Render Logout as a button
            if (action) {
              return (
                <button
                  key={name}
                  onClick={action}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 !bg-slate-800 text-white rounded hover:bg-red-600 shadow-md transition transform hover:scale-105 mt-1"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {!collapsed && <span className="text-sm">{name}</span>}
                </button>
              );
            }

            // Default link items
            return (
              <Link
                key={name}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 transition-colors ${
                  isActive ? "bg-slate-800 border-r-4 border-blue-500" : ""
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {!collapsed && <span className="text-sm">{name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
