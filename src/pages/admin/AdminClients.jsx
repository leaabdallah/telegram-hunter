import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const FLASK_API_BASE_URL = "http://127.0.0.1:5001"; // adjust if backend runs elsewhere

const AdminClients = () => {
  // Load clients from localStorage initially
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("adminClients");
    return saved ? JSON.parse(saved) : [];
  });

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    mispEventTitle: "",
    mispEventTags: "",
    mispApiKey: "",
  });

  const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
  };


  const [editingId, setEditingId] = useState(null); // track which client is being edited
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Persist clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adminClients", JSON.stringify(clients));
  }, [clients]);

  const addClient = () => {
    // Check for empty fields
    if (
      !newClient.name ||
      !newClient.email ||
      !newClient.mispEventTitle ||
      !newClient.mispApiKey
    ) {
      toast.error("All fields are required!");
const addClient = async () => {
  if (!newClient.name || !newClient.email) {
    toast.error("Name and Email are required");
    return;
  }

  // --- NEW: load from backend /api/clients_config ---
  const loadClientsFromAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FLASK_API_BASE_URL}/api/clients_config`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to load clients");
      }

      const list = Array.isArray(data.clients) ? data.clients : [];
      // Map backend fields to your UI shape and assign IDs
      const mapped = list.map((c, idx) => ({
        id: idx + 1,
        name: c.name || "",
        email: c.notification_recipient || "",
        mispEventTitle: c.misp_event_title || "",
        mispEventTags: Array.isArray(c.misp_event_tags)
          ? c.misp_event_tags.join(",")
          : (c.misp_event_tags || ""),
        // API key is redacted by backend; keep empty on UI
        mispApiKey: "",
      }));

      setClients(mapped);
      toast.success("Clients synced from server");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Could not load clients from server");
    } finally {
      setLoading(false);
    }
  };

  // Load once on mount
  useEffect(() => {
    loadClientsFromAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Name and Email are required");
      return;
    }
    
    // Validate email
    if (!isValidEmail(newClient.email)) {
      toast.error("Invalid email format!");

    if (!newClient.mispEventTitle || !newClient.mispApiKey) {
      toast.error("MISP Event Title and API Key are required");
      return;
    }

    const id = clients.length + 1;
    const payload = {
      name: newClient.name,
      notification_recipient: newClient.email,
      misp_event_title: newClient.mispEventTitle,
      misp_event_tags: (newClient.mispEventTags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      misp_api_key: newClient.mispApiKey,
      processed_files_file: `${newClient.name
        .toLowerCase()
        .replace(/\s+/g, "_")}_processed`,
      search_string: newClient.email ? [newClient.email] : [],
    };

    try {
      const res = await fetch(`${FLASK_API_BASE_URL}/api/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to add client");
        return;
      }

      const id = clients.length > 0 ? clients[clients.length - 1].id + 1 : 1;

      // Re-sync from server to reflect ground truth from config.json
      await loadClientsFromAPI();

      setClients([...clients, { id, ...newClient }]);
    setNewClient({ name: "", email: "", mispEvent: "", apiKey: "" });

      // Clear form
      setNewClient({
        name: "",
        email: "",
        mispEventTitle: "",
        mispEventTags: "",
        mispApiKey: "",
      });
      
    toast.success("Client created successfully!");
      toast.success(data?.message || "Client added!");
    } catch (err) {
      console.error(err);
      toast.error("Network error while adding client");
    }
  };

  const deleteClient = (id) => {
    // Local-only delete (your backend has no DELETE route yet)
    setClients(clients.filter((c) => c.id !== id));
    toast.success("Client deleted!");
  };

  const startEdit = (client) => {
    setEditingId(client.id);
    setNewClient({ ...client });
  };

  const saveEdit = () => {
    // Empty field check
    if (
      !newClient.name ||
      !newClient.email ||
      !newClient.mispEventTitle ||
      !newClient.mispEventTags ||
      !newClient.mispApiKey
    ) {
      toast.error("All fields are required!");
      return;
    }

    // Email validation
    if (!isValidEmail(newClient.email)) {
      toast.error("Invalid email format!");

    setClients(
      clients.map((c) =>
        c.id === editingId ? { id: c.id, ...newClient } : c
      )
    );
    setEditingId(null);

    // Reset form
    setNewClient({
      name: "",
      email: "",
      mispEventTitle: "",
      mispEventTags: "",
      mispApiKey: "",
    });
    toast.success("Client updated (local)!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewClient({ name: "", email: "", mispEventTitle: "", mispApiKey: "" });
    setNewClient({
      name: "",
      email: "",
      mispEventTitle: "",
      mispEventTags: "",
      mispApiKey: "",
    });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Create/Edit Client */}
      <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {editingId ? "Edit Client" : "Create New Client"}
          </h2>
          <button
            onClick={loadClientsFromAPI}
            disabled={loading}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-lg"
            style={{ backgroundColor: "transparent" }}
          >
            {loading ? "Syncing..." : "Sync from Server"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Name (unique identifier)"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={newClient.email}
          onChange={(e) =>
            setNewClient({ ...newClient, email: e.target.value })
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        <input
          type="text"
          placeholder="MISP Event Title"
          value={newClient.mispEventTitle}
          onChange={(e) =>
            setNewClient({ ...newClient, mispEventTitle: e.target.value })
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        <input
          type="text"
          placeholder="MISP Event Tags (comma-separated, eg., tlp:red,client-tag)"
          value={newClient.mispEventTags}
          onChange={(e) =>
            setNewClient({ ...newClient, mispEventTags: e.target.value })
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        <input
          type="text"
          placeholder="MISP API Key"
          value={newClient.mispApiKey}
          onChange={(e) =>
            setNewClient({ ...newClient, mispApiKey: e.target.value })
          }
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />

        <div className="flex gap-2">
          {editingId ? (
            <>
              <button
                onClick={saveEdit}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg"
              >
                Save Changes
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={addClient}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg"
            >
              Add Client
            </button>
          )}
        </div>
      </div>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
        />
      </div>

      {/* Client List */}
      <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold text-white">Manage Clients</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-gray-600">
              <th className="py-2">ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>MISP Event</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-700">
                <td className="py-2">{client.id}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.mispEventTitle}</td>
                <td>{client.mispApiKey}</td>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-gray-700">
                <td className="py-2">{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.mispEventTitle}</td>
                <td className="text-right flex gap-2 justify-end">
                  <button
                    onClick={() => startEdit(c)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClient(c.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-slate-400 py-4">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClients;
