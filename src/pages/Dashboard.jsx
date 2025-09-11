import React from "react";
import useLiveFeed from "../hooks/useLiveFeed";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const alerts = useLiveFeed();

  // Only keep the user-facing stats
  const stats = {
    totalAlerts: 1247,
    // filesScanned: 8932,        // removed for user dashboard
    // activeMonitors: 15,        // removed for user dashboard
    criticalAlerts: 23,
  };

  const alertTrends = [
    { date: "Mon", count: 20 },
    { date: "Tue", count: 45 },
    { date: "Wed", count: 30 },
    { date: "Thu", count: 75 },
    { date: "Fri", count: 60 },
  ];

  const fileTypes = [
    { type: "PDF", value: 10 },
    { type: "DOCX", value: 20 },
    { type: "JPG", value: 5 },
  ];

  const topKeywords = [
    { keyword: "password", count: 24 },
    { keyword: "api_key", count: 18 },
    { keyword: "token", count: 12 },
  ];

  const colors = ["#3B82F6", "#F59E0B", "#EF4444"];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Total Alerts" value={stats.totalAlerts} />
        <StatCard label="Critical Alerts" value={stats.criticalAlerts} />
        {/* For admin dashboard only:
        <StatCard label="Files Scanned" value={stats.filesScanned} />
        <StatCard label="Active Monitors" value={stats.activeMonitors} />
        */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-lg font-medium mb-4">Live Alerts Feed</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border border-slate-800 rounded-lg bg-slate-800"
              >
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>{alert.timestamp}</span>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <p className="text-slate-200 text-sm">
                  Keyword detected: <strong>{alert.keyword}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200 space-y-6">
          <h2 className="text-lg font-medium">Alerts Summary</h2>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertTrends}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#60A5FA"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fileTypes}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {fileTypes.map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topKeywords}>
                <XAxis dataKey="keyword" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="count" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-200 text-sm">
    <p className="text-slate-400 mb-1">{label}</p>
    <p className="text-xl font-semibold text-slate-100">
      {value.toLocaleString()}
    </p>
  </div>
);

const SeverityBadge = ({ severity }) => {
  const style = {
    low: "bg-green-600/20 text-green-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-orange-500/20 text-orange-400",
    critical: "bg-red-600/20 text-red-400",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${style[severity] || ""}`}>
      {severity?.toUpperCase?.() || "N/A"}
    </span>
  );
};

export default Dashboard;
