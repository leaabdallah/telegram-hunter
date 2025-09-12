import React, { useEffect, useMemo, useState } from "react";
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

const API_BASE_URL = "http://127.0.0.1:5001"; // adjust if deployed elsewhere

const AdminDashboard = () => {
  // Static stats (keep your cards as-is for now)
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

  // --- NEW: MISP events state ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch last 7d events (limit 50; tweak as you like)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/misp_events?limit=50`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch MISP events");
        setEvents(Array.isArray(data.misp_events) ? data.misp_events : []);
      } catch (e) {
        console.error(e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- Helpers to build chart data from events ---
  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const eventsPerDay = useMemo(() => {
    // Build counts by day name (Mon..Sun) from events' date field (YYYY-MM-DD)
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    for (const e of events) {
      // e.date is typically "YYYY-MM-DD"
      const d = e.date ? new Date(e.date) : null;
      if (!d || isNaN(d)) continue;
      const dayIdx = (d.getDay() + 6) % 7; // convert Sun(0)..Sat(6) -> Mon(0)..Sun(6)
      const day = weekdayOrder[dayIdx];
      counts[day] = (counts[day] || 0) + 1;
    }
    return weekdayOrder.map((day) => ({ day, scanned: counts[day] || 0 }));
  }, [events]);

  // Map threat levels -> names
  const threatName = (id) => {
    switch (String(id)) {
      case "1": return "High";
      case "2": return "Medium";
      case "3": return "Low";
      case "4": return "Undefined";
      default:  return "Unknown";
    }
  };

  const alertDistribution = useMemo(() => {
    const counts = {};
    for (const e of events) {
      const name = threatName(e.threat_level_id);
      counts[name] = (counts[name] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [events]);

  const COLORS = ["#FF4C4C", "#FF7F50", "#FFC107", "#4CAF50", "#94a3b8"];

  const recentAlerts = useMemo(() => {
    // Show the most recent few events (fall back to your static sample if none)
    if (!events.length) {
      return [
        { id: 101, type: "Critical", message: "Malware detected in file1.exe" },
        { id: 102, type: "High", message: "Suspicious login attempt" },
        { id: 103, type: "Medium", message: "Unusual network traffic" },
        { id: 104, type: "Low", message: "User failed login 3 times" },
      ];
    }
    // Map events -> table row (type from threat level, message from info)
    return events.slice(0, 10).map((e) => ({
      id: e.id,
      type: threatName(e.threat_level_id),
      message: e.info || e.uuid,
    }));
  }, [events]);

  const renderTrendIcon = (type) => {
    if (type === "up") return <ArrowUpIcon className="w-4 h-4 text-green-400 inline-block ml-1" />;
    if (type === "down") return <ArrowDownIcon className="w-4 h-4 text-red-400 inline-block ml-1" />;
    return <ArrowRightIcon className="w-4 h-4 text-gray-400 inline-block ml-1" />;
  };

  return (
    <div className="space-y-8">
      {/* Trend Cards (unchanged visual) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(stats).map((key) => (
          <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow">
            <p className="text-slate-400 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
            <p className="text-xl font-semibold text-slate-100">
              {stats[key].toLocaleString()}{" "}
              {trends[key] && renderTrendIcon(trends[key].type)}
              {trends[key] && (
                <span className="text-sm text-slate-300 ml-1">{trends[key].change}%</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {loading ? "Loading…" : "Events per Day (last 7d)"}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={eventsPerDay}>
              <XAxis dataKey="day" stroke="#888888" />
              <YAxis stroke="#888888" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="scanned" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-white">
            {loading ? "Loading…" : "Threat Level Distribution"}
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={alertDistribution.length ? alertDistribution : [{ name: "No data", value: 1 }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {(alertDistribution.length ? alertDistribution : [{ name: "No data", value: 1 }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts Table (now driven by events when available) */}
      <div className="bg-slate-900 p-5 rounded-xl shadow overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-white">
          {loading ? "Loading Recent Events…" : "Recent Alerts"}
        </h2>
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
            {!recentAlerts.length && !loading && (
              <tr>
                <td colSpan="3" className="text-center text-slate-400 py-4">
                  No alerts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions (left as placeholders) */}
      <div className="flex gap-4">
        <button
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg shadow"
          style={{ backgroundColor: "transparent" }}
          onClick={() => alert("TODO: wire to a scan trigger endpoint")}
        >
          Scan Now
        </button>
        <button
          className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg shadow"
          style={{ backgroundColor: "transparent" }}
          onClick={() => alert("TODO: open Add User modal")}
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
