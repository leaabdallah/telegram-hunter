import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
  HomeIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BellIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Footer from "../Footer";
import NavBar from "./NavBar";

export default function AdminLayout() {
  const location = useLocation();

  // Default collapsed state: try to load from localStorage first
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save collapsed state whenever it changes
  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  // Auth check
  const isAuth = localStorage.getItem("auth");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!isAuth) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const sidebarItems = [
    { label: "Dashboard", to: "/admin", icon: HomeIcon },
    { label: "Users", to: "/admin/users", icon: UserGroupIcon },
    { label: "Clients", to: "/admin/clients", icon: UserGroupIcon },
    {
      label: "Leak Hunter",
      to: "/admin/LeakHunter",
      icon: MagnifyingGlassIcon,
    },
    { label: "Logs", to: "/admin/logs", icon: DocumentTextIcon },
    { label: "Alerts", to: "/admin/alerts", icon: BellIcon },
    { label: "Settings", to: "/admin/settings", icon: Cog6ToothIcon },
    { label: "Logout", action: handleLogout, icon: ArrowRightOnRectangleIcon },
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside
        className={`h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? "w-15" : "w-53"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && <h1 className="text-lg font-bold">Threat Watch</h1>}
          {collapsed ? (
            <Bars3Icon
              className="w-6 h-6 cursor-pointer text-slate-300 hover:text-white transition"
              onClick={() => setCollapsed(false)}
            />
          ) : (
            <XMarkIcon
              className="w-6 h-6 cursor-pointer text-slate-300 hover:text-white transition"
              onClick={() => setCollapsed(true)}
            />
          )}
        </div>

        {/* Menu items */}
        <nav className="mt-4 flex flex-col" style={{ height: "100%" }}>
          <div>
            {sidebarItems.map(({ label, to, icon: Icon, action }) => {
              const isActive = location.pathname === to;
              const iconWrapper = (
                <div className="w-5 h-5 flex items-center justify-center">
                  {Icon && <Icon className="w-5 h-5 shrink-0 stroke-[1.5]" />}
                </div>
              );
              return to ? (
                <Link
                  key={label}
                  to={to}
                  className={`flex items-center space-x-3 px-4 py-3 hover:bg-slate-800 transition-colors ${
                    isActive ? "bg-slate-800 border-r-4 border-blue-500" : ""
                  }`}
                >
                  {iconWrapper}
                  {!collapsed && <span className="text-sm">{label}</span>}
                  {!isActive && collapsed && (
                    <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                      {label}
                    </span>
                  )}
                </Link>
              ) : (
                <button
                  key={label}
                  onClick={action}
                  className="flex items-center space-x-3 w-full px-4 py-3 !bg-slate-800 text-white rounded hover:bg-red-700 shadow-lg transition transform hover:scale-105 mt-1"
                >
                  {iconWrapper}
                  {!collapsed && <span className="text-sm">{label}</span>}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 bg-slate-900">
        <NavBar />
        <main className="flex-1 p-6 overflow-y-auto relative bg-slate-900">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
