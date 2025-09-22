import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/NavBar";
import Sidebar from "./components/layout/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="bg-[#0f172a] text-slate-100 min-h-screen flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-col min-h-screen w-full transition-all duration-300">
        <Navbar
          onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl w-full px-4 py-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
