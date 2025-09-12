import React, { useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const defaultForm = {
    emailNotifications: true,
    emailAlertLevel: "all",
    backupFrequency: "daily",
    apiKey: "",
    debugMode: false,
    maxAlerts: 100,
    apiBaseUrl: "http://127.0.0.1:5001", // keep API base URL configurable
  };

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("adminSettings");
    return saved ? JSON.parse(saved) : defaultForm;
  });

  const [apiStatus, setApiStatus] = useState(null); // holds /api/status result

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    if (!form.apiKey) {
      toast.error("API Key cannot be empty!");
      return;
    }
    if (form.debugMode) {
      console.log(
        "%cDEBUG MODE ACTIVE",
        "color: red; font-weight: bold; font-size: 16px;"
      );
      console.log("Current Settings:", form);
      alert("Debug Mode is ON! Check the console for detailed logs.");
    }
    localStorage.setItem("adminSettings", JSON.stringify(form));
    toast.success("Settings saved!");
  };

  // --- API call: test backend status ---
  const testBackend = async () => {
    const url = `${form.apiBaseUrl}/api/status`;
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to reach backend");
      }
      setApiStatus(data);
      toast.success("Backend is reachable!");
    } catch (err) {
      setApiStatus(null);
      toast.error(`Backend check failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Settings</h1>

      {/* Notifications & Backup */}
      <section className="bg-slate-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Notifications & Backup</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={form.emailNotifications}
                onChange={handleChange}
              />
              Enable Email Notifications
            </label>
          </div>
          {form.emailNotifications && (
            <div>
              <label className="block mb-1">Default Alert Level</label>
              <select
                name="emailAlertLevel"
                value={form.emailAlertLevel}
                onChange={handleChange}
                className="w-full p-2 rounded bg-slate-700 text-white"
              >
                <option value="all">All Alerts</option>
                <option value="critical">Critical Only</option>
                <option value="none">None</option>
              </select>
            </div>
          )}
          <div>
            <label className="block mb-1">Backup Frequency</label>
            <select
              name="backupFrequency"
              value={form.backupFrequency}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-700 text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </section>

      {/* Advanced */}
      <section className="bg-slate-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">API Key</label>
            <input
              type="password"
              name="apiKey"
              value={form.apiKey}
              onChange={handleChange}
              placeholder="Enter API Key"
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-1">Max Alerts</label>
            <input
              type="number"
              name="maxAlerts"
              value={form.maxAlerts}
              onChange={handleChange}
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="debugMode"
                checked={form.debugMode}
                onChange={handleChange}
                className="w-4 h-4"
              />
              Enable Debug Mode
            </label>
          </div>

          {form.debugMode && (
            <div className="mt-4 p-3 bg-red-600 text-white rounded font-bold">
              DEBUG MODE IS ACTIVE! Extra logging enabled.
            </div>
          )}
        </div>
      </section>

      {/* Backend Connectivity */}
      <section className="bg-slate-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Backend Connectivity</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">API Base URL</label>
            <input
              type="text"
              name="apiBaseUrl"
              value={form.apiBaseUrl}
              onChange={handleChange}
              placeholder="http://127.0.0.1:5001"
              className="w-full p-2 rounded bg-slate-700 text-white"
            />
            <p className="text-sm text-slate-400 mt-1">
              Example: http://127.0.0.1:5001 (local) or http://YOUR_VM_IP:5001
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={testBackend}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow text-white"
              style={{ backgroundColor: "transparent" }}
            >
              Test Backend
            </button>

            {apiStatus && (
              <span className="text-emerald-300 text-sm">
                ✅ {apiStatus?.status} | ts: {String(apiStatus?.timestamp)}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg shadow"
          style={{ backgroundColor: "transparent" }}
        >
          Save Settings
        </button>

        <button
          onClick={() => {
            setForm(defaultForm);
            setApiStatus(null);
            toast.success("Settings reset to default!");
          }}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg shadow"
          style={{ backgroundColor: "transparent" }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
