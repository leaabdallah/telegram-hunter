import {
  HomeIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Alerts", path: "/alerts", icon: BellAlertIcon },
  { name: "Leak Hunter", path: "/leak-hunter", icon: MagnifyingGlassIcon },
  { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
];

const handleLogout = () => {
  localStorage.removeItem("auth");
  window.location.href = "/login";
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h1 className="text-lg font-bold">Threat Watch</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hover:text-white"
          style={{ backgroundColor: "transparent" }}
        >
          {collapsed ? (
            <Bars3Icon className="w-6 h-6" />
          ) : (
            <XMarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Menu items */}
      <nav className="mt-4 flex flex-col" style={{ height: "100%" }}>
        <div>
          {navItems.map(({ name, path, icon: Icon }) => {
            const isActive = location.pathname === path;
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

          {/* Logout button directly after menu items */}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-blue-1000 text-black px-4 py-2 rounded shadow hover:bg-blue-300"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
