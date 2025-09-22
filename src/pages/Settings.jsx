import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const SETTINGS_KEY = "threatwatch_user_settings";

const Settings = () => {
  const [notifications, setNotifications] = useState("all"); // all | critical | none
  const [twoFactor, setTwoFactor] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed.notifications || "all");
      setTwoFactor(parsed.twoFactor ?? false);
      setAnalytics(parsed.analytics ?? true);
    } else {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          notifications: "all",
          twoFactor: false,
          analytics: true,
        })
      );
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ notifications, twoFactor, analytics })
    );
    toast.success("Settings saved!");
  };

  const resetSettings = () => {
    const defaults = {
      notifications: "all",
      twoFactor: false,
      analytics: true,
    };
    setNotifications(defaults.notifications);
    setTwoFactor(defaults.twoFactor);
    setAnalytics(defaults.analytics);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
    toast("Settings reset to defaults");
  };

  return (
    <div className="space-y-8 min-h-full bg-slate-900">
      <div className="bg-gray-800 rounded-xl p-6 space-y-6 shadow">
        <h2 className="text-xl font-semibold text-white">Preferences</h2>

        {/* Notifications level */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Notifications
          </label>
          <select
            value={notifications}
            onChange={(e) => setNotifications(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Alerts</option>
            <option value="critical">Critical Only</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="twoFactor"
            checked={twoFactor}
            onChange={(e) => setTwoFactor(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="twoFactor" className="text-sm text-gray-300">
            Enable Two-Factor Authentication
          </label>
        </div>

        {/* Analytics toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="analytics"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
          />
          <label htmlFor="analytics" className="text-sm text-gray-300">
            Share anonymous usage analytics
          </label>
        </div>

        {/* Save / Reset buttons */}
        <button
          onClick={saveSettings}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2 rounded-lg shadow"
        >
          Save Settings
        </button>

        <button
          onClick={resetSettings}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 py-2 rounded-lg"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Settings;
