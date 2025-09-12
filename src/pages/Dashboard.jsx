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

// Adjust for your deployment (or read from settings/localStorage)
const API_BASE_URL = "http://127.0.0.1:5001";

// Map MISP threat levels to labels/colors
const THREAT_NAME = {
  "1": "High",
  "2": "Medium",
  "3": "Low",
  "4": "Undefined",
};
const PIE_COLORS = ["#EF4444", "#F59E0B", "#10B981", "#94A3B8"];

const Dashboard = () => {
  const alerts = useLiveFeed();

  // --- Fetch recent events (last 7d on the backend) ---
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/misp_events?limit=100`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch events");
        setEvents(Array.isArray(data.misp_events) ? data.misp_events : []);
      } catch (e) {
        console.error(e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- Stats (computed from events) ---
  const totalAlerts = events.length;
  const criticalAlerts = React.useMemo(() => {
    // Treat MISP "High" (1) as critical for the user view
    return events.filter((e) => String(e.threat_level_id) === "1").length;
  }, [events]);

  // --- Line chart: events per day (Mon..Fri ordering for readability) ---
  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const alertTrends = React.useMemo(() => {
    const byDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    for (const e of events) {
      const d = e.date ? new Date(e.date) : null; // e.date = "YYYY-MM-DD"
      if (!d || isNaN(d)) continue;
      const dayIdx = (d.getDay() + 6) % 7; // Sun(0)->6, Mon(1)->0 ...
      const day = weekdayOrder[dayIdx];
      byDay[day] = (byDay[day] || 0) + 1;
    }
    return weekdayOrder.map((day) => ({ date: day, count: byDay[day] || 0 }));
  }, [events]);

  // --- Pie chart: threat distribution ---
  const threatPie = React.useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0, Undefined: 0 };
    for (const e of events) {
      const key = THREAT_NAME[String(e.threat_level_id)] || "Undefined";
      counts[key] = (counts[key] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([type, value]) => ({ type, value }))
      .filter((x) => x.value > 0);
  }, [events]);

  // --- Bar chart: top tags (instead of file types/keywords, which aren’t in events) ---
  // We count tag names and show the top 8.
  const topTags = React.useMemo(() => {
    const freq = {};
    for (const e of events) {
      const tags = Array.isArray(e.Tag) ? e.Tag : [];
      for (const t of tags) {
        const name = t?.name || "";
        if (!name) continue;
        // Optional: skip very generic tags
        // if (name.startsWith("tlp:")) continue;
        freq[name] = (freq[name] || 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([type, value]) => ({ type, value }));
  }, [events]);

  // Keep your color set for the pie/bar
  const colors = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981", "#6366F1", "#06B6D4", "#E11D48", "#84CC16"];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Total Alerts" value={totalAlerts || 0} />
        <StatCard label="Critical Alerts" value={criticalAlerts || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200">
          <h2 className="text-lg font-medium mb-4">
            {loading ? "Live Alerts Feed (loading…)" : "Live Alerts Feed"}
          </h2>
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
            {!alerts.length && (
              <div className="text-slate-400 text-sm">No live alerts.</div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-md hover:shadow-lg transition-shadow duration-200 space-y-6">
          <h2 className="text-lg font-medium">
            {loading ? "Alerts Summary (loading…)" : "Alerts Summary"}
          </h2>

          {/* Line: Alerts over weekdays */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertTrends}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie: Threat distribution */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatPie.length ? threatPie : [{ type: "No data", value: 1 }]}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {(threatPie.length ? threatPie : [{ type: "No data", value: 1 }]).map((entry, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar: Top tags */}
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topTags.length ? topTags : [{ type: "No tags", value: 0 }]}>
                <XAxis dataKey="type" stroke="#ccc" hide={false} />
                <YAxis stroke="#ccc" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#F97316">
                  {(topTags.length ? topTags : [{ type: "No tags", value: 0 }]).map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
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
    <p className="text-xl font-semibold text-slate-100">{Number(value).toLocaleString()}</p>
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
