import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 text-center text-sm text-slate-400 border-t border-slate-700 pt-4">
      © {year} TelegramHunter Intel. All rights reserved.
    </footer>
  );
};

export default Footer;
