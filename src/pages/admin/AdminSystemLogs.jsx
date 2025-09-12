import React, { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5001"; // adjust if backend is remote

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [lines, setLines] = useState(50); // how many lines to fetch
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/logs?lines=${lines}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch logs");
      }

      // turn plain log lines into objects with id/timestamp
      const parsed = (data.logs || []).map((line, idx) => ({
        id: idx + 1,
        user: "-", // scanner.log doesn’t have user info
        action: line,
        timestamp: "", // scanner.log line already contains date/time at start
      }));

      setLogs(parsed);
    } catch (err) {
      console.error(err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
      <h2 className="text-xl font-semibold text-white">System Logs</h2>

      <div className="flex gap-2 items-center">
        <input
          type="number"
          min="1"
          max="200"
          value={lines}
          onChange={(e) => setLines(e.target.value)}
          className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-white"
        />
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          disabled={loading}
        >
          {loading ? "Loading..." : "Fetch Logs"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Filter logs..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
      />

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-gray-600">
            <th className="py-2">ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id} className="border-b border-gray-700">
              <td className="py-2">{log.id}</td>
              <td className="font-mono">{log.action}</td>
            </tr>
          ))}
          {filteredLogs.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center text-slate-400 py-4">
                No logs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLogs;
