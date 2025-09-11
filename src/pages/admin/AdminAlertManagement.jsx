import React, { useState } from "react";
import { toast } from "sonner";

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 101,
      type: "Critical",
      message: "Malware detected in file1.exe",
      status: "Open",
    },
    {
      id: 102,
      type: "High",
      message: "Suspicious login attempt",
      status: "Open",
    },
    {
      id: 103,
      type: "Medium",
      message: "Unusual network traffic",
      status: "Resolved",
    },
  ]);

  const resolveAlert = (id) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
    );
    toast.success(`Alert #${id} resolved`);
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    toast.success(`Alert #${id} deleted`);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
      <h2 className="text-xl font-semibold text-white">Manage Alerts</h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-gray-600">
            <th className="py-2">ID</th>
            <th>Type</th>
            <th>Message</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id} className="border-b border-gray-700">
              <td className="py-2">{a.id}</td>
              <td>{a.type}</td>
              <td>{a.message}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    a.status === "Resolved"
                      ? "bg-green-700 text-white"
                      : "bg-red-700 text-white"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="text-right space-x-2">
                {a.status !== "Resolved" && (
                  <button
                    onClick={() => resolveAlert(a.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => deleteAlert(a.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  style={{ backgroundColor: "transparent" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {alerts.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-slate-400 py-4">
                No alerts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAlerts;
