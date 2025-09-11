import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

const AdminDashboard = () => {
  const stats = {
    totalAlerts: 1247,
    filesScanned: 8932,
    activeMonitors: 15,
    criticalAlerts: 23,
  };

  const trends = {
    totalAlerts: { change: 10, type: "up" },
    filesScanned: { change: 3, type: "down" },
    activeMonitors: { change: 0, type: "neutral" },
    criticalAlerts: { change: 5, type: "up" },
  };

  const fileScanData = [
    { day: "Mon", scanned: 1200 },
    { day: "Tue", scanned: 1500 },
    { day: "Wed", scanned: 1300 },
    { day: "Thu", scanned: 1700 },
    { day: "Fri", scanned: 1600 },
    { day: "Sat", scanned: 1400 },
    { day: "Sun", scanned: 1332 },
  ];

  const alertDistribution = [
    { name: "Critical", value: stats.criticalAlerts },
    { name: "High", value: 45 },
    { name: "Medium", value: 120 },
    { name: "Low", value: 1079 },
  ];

  const COLORS = ["#FF4C4C", "#FF7F50", "#FFC107", "#4CAF50"];

  const recentAlerts = [
    { id: 101, type: "Critical", message: "Malware detected in file1.exe" },
    { id: 102, type: "High", message: "Suspicious login attempt" },
    { id: 103, type: "Medium", message: "Unusual network traffic" },
    { id: 104, type: "Low", message: "User failed login 3 times" },
  ];

  const renderTrendIcon = (type) => {
    if (type === "up")
      return (
        <ArrowUpIcon className="w-4 h-4 text-green-400 inline-block ml-1" />
      );
    if (type === "down")
      return (
        <ArrowDownIcon className="w-4 h-4 text-red-400 inline-block ml-1" />
      );
    return (
      <ArrowRightIcon className="w-4 h-4 text-gray-400 inline-block ml-1" />
    );
  };

  return (
    <div className="space-y-8">
      {/* Trend Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(stats).map((key) => (
          <div
            key={key}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow"
          >
            <p className="text-slate-400 text-sm capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </p>
            <p className="text-xl font-semibold text-slate-100">
              {stats[key].toLocaleString()}{" "}
              {trends[key] && renderTrendIcon(trends[key].type)}
              {trends[key] && (
                <span className="text-sm text-slate-300 ml-1">
                  {trends[key].change}%
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Files Scanned (Weekly)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fileScanData}>
              <XAxis dataKey="day" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Bar dataKey="scanned" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Alert Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={alertDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {alertDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-slate-900 p-5 rounded-xl shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-white">Recent Alerts</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-gray-600">
              <th className="py-2">ID</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {recentAlerts.map((alert) => (
              <tr key={alert.id} className="border-b border-gray-700">
                <td className="py-2">{alert.id}</td>
                <td>{alert.type}</td>
                <td>{alert.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg shadow"
          style={{ backgroundColor: "transparent" }}
        >
          Scan Now
        </button>
        <button
          className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg shadow"
          style={{ backgroundColor: "transparent" }}
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
