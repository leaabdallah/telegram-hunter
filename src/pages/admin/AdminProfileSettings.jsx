// src/pages/admin/AdminSettings.jsx
import React from "react";

const AdminSettings = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="p-6 bg-slate-900 min-h-[80vh] text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
      <p>Welcome, {user.username}. Here you can manage admin settings.</p>

      {/* Example settings sections */}
      <div className="mt-6 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold">Manage Users</h2>
          <p className="text-gray-400">
            Add, edit, or remove users from the system.
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold">System Configurations</h2>
          <p className="text-gray-400">
            Configure system-wide options for the application.
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-semibold">Alert Settings</h2>
          <p className="text-gray-400">
            Adjust thresholds and notifications for alerts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
