import React, { useState } from "react";

const AdminLogs = () => {
  const [logs] = useState([
    {
      id: 1,
      user: "admin",
      action: "Logged in",
      timestamp: "2025-09-08 10:23",
    },
    {
      id: 2,
      user: "analyst1",
      action: "Triggered scan",
      timestamp: "2025-09-08 10:45",
    },
    {
      id: 3,
      user: "monitor1",
      action: "Viewed alerts",
      timestamp: "2025-09-08 11:10",
    },
    {
      id: 4,
      user: "admin",
      action: "Deleted alert #23",
      timestamp: "2025-09-08 11:40",
    },
  ]);

  const [filter, setFilter] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.user.toLowerCase().includes(filter.toLowerCase()) ||
      log.action.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
      <h2 className="text-xl font-semibold text-white">System Logs</h2>

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
            <th>User</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => (
            <tr key={log.id} className="border-b border-gray-700">
              <td className="py-2">{log.id}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
          {filteredLogs.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-slate-400 py-4">
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
