import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const SETTINGS_KEY = 'threatwatch_user_settings';

const Settings = () => {
  const [theme, setTheme] = useState('dark'); // dark | light
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTheme(parsed.theme || 'dark');
      setNotifications(parsed.notifications ?? true);
    } else {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ theme: 'dark', notifications: true })
      );
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ theme, notifications })
    );
    toast.success('Settings saved!');
  };

  const resetSettings = () => {
    const defaults = { theme: 'dark', notifications: true };
    setTheme(defaults.theme);
    setNotifications(defaults.notifications);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
    toast('Settings reset to defaults');
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-xl p-6 space-y-4 shadow">
        <h2 className="text-xl font-semibold text-white">Preferences</h2>

        {/* Theme toggle */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="notifications" className="text-sm text-gray-300">
            Enable alert notifications
          </label>
        </div>

        <button
          onClick={saveSettings}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2 rounded-lg shadow"
        >
          Save Settings
        </button>

        <button
          onClick={resetSettings}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2 rounded-lg mt-2"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Settings;
