import { useState } from "react";
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
  ArrowRightOnRectangleIcon, // Logout icon
} from "@heroicons/react/24/outline";
import Footer from "../Footer";

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    { label: "Logout", action: handleLogout, icon: ArrowRightOnRectangleIcon }, // logout item
  ];

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside
        className={`bg-slate-800 p-4 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "w-60" : "w-16"
        }`}
      >
        {/* Top section: Title + toggle button */}
        <div className="flex items-center justify-between mb-6">
          {isSidebarOpen && <h1 className="text-lg font-bold">Admin Panel</h1>}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:opacity-75 bg-transparent"
            style={{ backgroundColor: "transparent" }}
          >
            {isSidebarOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Sidebar items */}
        <nav className="flex-1 mt-2 space-y-2">
          {sidebarItems.map(({ label, to, icon: Icon, action }) => (
            <div key={label} className="relative group">
              {to ? (
                <Link
                  to={to}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    location.pathname === to
                      ? "bg-slate-700"
                      : "hover:bg-slate-700"
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  {isSidebarOpen && <span>{label}</span>}
                </Link>
              ) : (
                <button
                  onClick={action}
                  className={`flex items-center gap-2 p-2 w-full rounded-lg text-left transition-colors
    bg-transparent hover:bg-slate-700 focus:outline-none focus:ring-0`}
                  style={{ backgroundColor: "transparent" }}
                >
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  {isSidebarOpen && <span>{label}</span>}
                </button>
              )}

              {/* Tooltip (only when collapsed) */}
              {!isSidebarOpen && (
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto relative">
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
