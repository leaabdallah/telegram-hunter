import { useState, useEffect } from "react";
import { toast } from "sonner";
import Select from "react-select";
import { TrashIcon } from "@heroicons/react/24/solid";

const mockAlerts = [
  {
    id: 1,
    timestamp: "2025-08-01 12:00",
    keyword: "Telegram Bot",
    severity: "High",
    status: "Compromised",
    reviewed: false,
    message: "Suspicious Telegram bot activity detected.",
    note: "",
  },
  {
    id: 2,
    timestamp: "2025-08-02 09:30",
    keyword: "Leaked File",
    severity: "Medium",
    status: "Secure",
    reviewed: true,
    message: "Publicly accessible .zip file found in group.",
    note: "",
  },
];

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [alerts, setAlerts] = useState(() => {
    const stored = localStorage.getItem("alerts");
    return stored ? JSON.parse(stored) : mockAlerts;
  });
  const [newKeyword, setNewKeyword] = useState("");
  const [newSeverity, setNewSeverity] = useState("Low");
  const [noteInput, setNoteInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 5;
  const [newStatus, setNewStatus] = useState("Secure");

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  const getUTCTime = () => {
    return new Date().toISOString(); // always UTC format
  };

  const handleAddPost = () => {
    if (!newKeyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    const newAlert = {
      id: Date.now(),
      timestamp: getUTCTime(),
      keyword: newKeyword,
      severity: newSeverity,
      status: newStatus,
      reviewed: false,
      message: "This is a newly added alert post.",
      note: "",
    };
    setAlerts([newAlert, ...alerts]);
    setNewKeyword("");
    toast.success("New alert added");
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);

    // If parsing fails, return the string as-is (for old saved alerts)
    if (isNaN(date.getTime())) return ts;

    return date.toLocaleString(undefined, {
      hour12: false,
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const handleSeverityChange = (e) => {
    const newSeverity = e.target.value;
    const updated = alerts.map((alert) => {
      if (alert.id === selectedAlert.id) {
        const updatedAlert = { ...alert, severity: newSeverity };
        setSelectedAlert(updatedAlert);
        return updatedAlert;
      }
      return alert;
    });
    setAlerts(updated);
  };

  const handleAddNote = () => {
    const updated = alerts.map((alert) => {
      if (alert.id === selectedAlert.id) {
        const updatedAlert = { ...alert, note: noteInput };
        setSelectedAlert(updatedAlert);
        return updatedAlert;
      }
      return alert;
    });
    setAlerts(updated);
    setNoteInput("");
    toast.success("Note saved");
  };

  const handleExport = () => {
    // Format timestamp cleanly
    let formattedTimestamp;
    const date = new Date(selectedAlert.timestamp);
    if (isNaN(date.getTime())) {
      // Fallback for old alerts (keep raw string)
      formattedTimestamp = selectedAlert.timestamp;
    } else {
      // Format for user's local timezone
      formattedTimestamp = date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }

    const content = `Alert Report:\n\nTimestamp: ${formattedTimestamp}\nKeyword: ${
      selectedAlert.keyword
    }\nSeverity: ${selectedAlert.severity}\nStatus: ${
      selectedAlert.status
    }\nMessage: ${selectedAlert.message}\nNote: ${
      selectedAlert.note || "None"
    }`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `alert_${selectedAlert.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("Alert exported");
  };

  const handleClearAll = () => {
    setAlerts([]); // React state handles storage sync
    setSelectedAlert(null);
    toast.success("All alerts cleared");
  };

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);
  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const severityOptions = [
    { value: "Low", label: "Low", color: "#22c55e" },
    { value: "Medium", label: "Medium", color: "#f97316" },
    { value: "High", label: "High", color: "#ef4444" },
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#0f172a", // Tailwind's bg-blue-1000
      color: "white",
      borderColor: "#334155",
      padding: "2px",
      borderRadius: "0.375rem",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#0f172a",
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#1e293b" : "#0f172a",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
  };

  const StatusOption = (props) => (
    <components.Option {...props}>
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: props.data.color,
          marginRight: 8,
        }}
      />
      {props.label}
    </components.Option>
  );

  const StatusSingleValue = (props) => (
    <components.SingleValue {...props}>
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: props.data.color,
          marginRight: 8,
        }}
      />
      {props.data.label}
    </components.SingleValue>
  );

  const handleDeleteAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    toast.success("Alert deleted");
  };

  const statusOptions = [
    { value: "Secure", label: "Secure", color: "#22c55e" }, // green
    { value: "Compromised", label: "Compromised", color: "#ef4444" }, // red
  ];

  return (
    <div className="p-4 bg-black-100 min-h-screen text-gray-900 relative">
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-2 items-center">
          <input
            className="border border-gray-300 px-3 py-2 rounded shadow-sm text-sm text-white placeholder:text-white bg-blue-1000 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter Details"
            style={{ height: "42px" }}
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddPost();
            }}
          />

          <Select
            options={severityOptions}
            value={severityOptions.find((opt) => opt.value === newSeverity)}
            onChange={(selected) => setNewSeverity(selected.value)}
            styles={customStyles}
            placeholder="Select severity"
            isSearchable={false}
          />

          <Select
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === newStatus)}
            onChange={(selected) => setNewStatus(selected.value)}
            styles={customStyles}
            placeholder="Select status"
            isSearchable={false}
          />

          <button
            className="bg-blue-200 text-black px-4 py-2 rounded shadow hover:bg-blue-300"
            onClick={handleAddPost}
          >
            + Add Post
          </button>
          <button
            className="bg-red-200 text-black px-4 py-2 rounded shadow hover:bg-red-300"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-lg shadow overflow-hidden border-separate border-spacing-0">
          <thead>
            <tr className="bg-blue-100 text-gray-700">
              <th className="p-3 text-center rounded-tl-lg"> </th>
              <th className="p-3 text-left"> </th>
              <th className="p-3 text-left">Timestamp</th>
              <th className="p-3 text-left">Details</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center rounded-tr-lg">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentAlerts.map((alert) => (
              <tr
                key={alert.id}
                className="hover:bg-blue-50 cursor-pointer"
                onClick={() => {
                  setSelectedAlert(alert);
                  setNoteInput(alert.note);
                }}
              >
                <td className="p-3 border-t border-gray-200 text-center">
                  <span>
                    <input
                      type="checkbox"
                      checked={alert.reviewed}
                      onChange={(e) => {
                        e.stopPropagation(); // prevent opening drawer
                        const updated = alerts.map((a) =>
                          a.id === alert.id
                            ? { ...a, reviewed: !a.reviewed }
                            : a
                        );
                        setAlerts(updated);
                      }}
                      onClick={(e) => e.stopPropagation()} // extra safety
                      title={
                        alert.reviewed
                          ? "Mark as Unreviewed"
                          : "Mark as Reviewed"
                      }
                      className="w-5 h-5 cursor-pointer accent-blue-600"
                    />
                  </span>
                </td>
                <td className="p-3 border-t border-gray-200 text-right">
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // prevents opening drawer when clicking the dot
                      const newSeverity =
                        alert.severity === "Low"
                          ? "Medium"
                          : alert.severity === "Medium"
                          ? "High"
                          : "Low";

                      const updated = alerts.map((a) =>
                        a.id === alert.id ? { ...a, severity: newSeverity } : a
                      );
                      setAlerts(updated);
                    }}
                    title={`${alert.severity} severity`} // tooltip
                    className={`inline-block w-3 h-3 rounded-full cursor-pointer transition ${
                      alert.severity === "High"
                        ? "bg-red-600 hover:bg-red-700"
                        : alert.severity === "Medium"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  ></span>
                </td>
                <td className="p-3 border-t border-gray-200">
                  {formatTimestamp(alert.timestamp).toLocaleString(undefined, {
                    hour12: false,
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td className="p-3 border-t border-gray-200">
                  {alert.keyword}
                </td>
                <td className="p-3 border-t border-gray-200">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                      alert.status === "Compromised"
                        ? "bg-red-600"
                        : "bg-green-600"
                    }`}
                  >
                    {alert.status}
                  </span>
                </td>
                <td className="p-3 border-t border-gray-200 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAlert(alert.id);
                    }}
                    title="Delete Alert"
                    className="p-2 rounded hover:bg-red-100"
                  >
                    <img
                      src="/trash.svg.svg"
                      alt="Delete"
                      className="w-5 h-5"
                    />{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="px-2 py-1 text-xs rounded transition-colors"
          style={{
            backgroundColor: "#0f172a", // dark blue
            color: "white",
          }}
        >
          {showLegend ? "Hide Severity Legend" : "Show Severity Legend"}
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showLegend ? "w-64 opacity-100 ml-2" : "w-0 opacity-0"
          }`}
        >
          <div className="flex items-center space-x-4 bg-[#0f172a] text-white px-3 py-1 rounded">
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-2 text-sm">
        {[...Array(totalPages)].map((_, index) => {
          const isActive = currentPage === index + 1;
          return (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded border text-sm font-medium 
          ${
            isActive
              ? "!bg-blue-900 !text-white !border-blue-600"
              : "!bg-blue-800 !text-white !border-blue-500 hover:!bg-blue-900"
          }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      {selectedAlert && (
        <div className="absolute inset-0 bg-blue-1000 bg-opacity-40 flex justify-end z-50">
          <div className="w-full max-w-md bg-gray-900 text-white shadow-2xl p-6 relative rounded-l-xl">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
              onClick={() => setSelectedAlert(null)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-white-800 mb-3">
              Alert Details
            </h3>
            <p>
              <strong>Timestamp:</strong>{" "}
              {isNaN(new Date(selectedAlert.timestamp).getTime())
                ? selectedAlert.timestamp // fallback: show raw string
                : new Date(selectedAlert.timestamp).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
            </p>
            <p>
              <strong>Keyword:</strong> {selectedAlert.keyword}
            </p>
            <div className="my-2">
              <strong>Severity:</strong>
              <select
                value={selectedAlert.severity}
                onChange={handleSeverityChange}
                className="ml-2 border px-2 py-1 rounded text-sm bg-blue-1000"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="my-2">
              <strong>Status:</strong>
              <select
                value={selectedAlert.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  const updated = alerts.map((alert) =>
                    alert.id === selectedAlert.id
                      ? { ...alert, status: newStatus }
                      : alert
                  );
                  setAlerts(updated);
                  setSelectedAlert({ ...selectedAlert, status: newStatus });
                }}
                className="ml-2 border px-2 py-1 rounded text-sm bg-blue-1000"
              >
                <option value="Secure">Secure</option>
                <option value="Compromised">Compromised</option>
              </select>
            </div>
            <p>
              <strong>Status:</strong> {selectedAlert.status}
            </p>
            <p className="mt-3">
              <strong>Message:</strong>
              <br />
              {selectedAlert.message}
            </p>

            <div className="mt-4">
              <label className="block font-semibold mb-1">Note:</label>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a note..."
              />
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  const updated = alerts.map((alert) => {
                    if (alert.id === selectedAlert.id) {
                      const updatedAlert = { ...alert, status: "Secure" };
                      setSelectedAlert(updatedAlert);
                      return updatedAlert;
                    }
                    return alert;
                  });
                  setAlerts(updated);
                  toast.success("Marked as Secure");
                }}
                className="w-full bg-blue-200 text-black p-2 rounded hover:bg-blue-300"
              >
                Mark as Secure
              </button>
              <button
                onClick={handleExport}
                className="w-full bg-green-200 text-black p-2 rounded hover:bg-green-300"
              >
                Export
              </button>
              <button
                onClick={handleAddNote}
                className="w-full bg-yellow-300 text-black p-2 rounded hover:bg-yellow-400"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
