import React from 'react';
import { useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';


const pageTitles = {
  dashboard: 'Dashboard',
  alerts: 'Alerts',
  'leak-hunter': 'Leak Hunter',
  settings: 'Settings',
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const currentPage = location.pathname.split('/')[1];

  return (
  <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
    <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
        >
          ☰
        </button>

        <div className="text-gray-200 text-sm font-semibold uppercase tracking-wider">
          {pageTitles[currentPage] || 'Dashboard'}
        </div>

       <div className="flex items-center space-x-4">
  <ThemeToggle />
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white">
            👤
  
  
</div>
      </div>
      </div>
    </header>
  );
};

export default Navbar;
