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

  const [editingId, setEditingId] = useState(null); // track which client is being edited

  // Persist clients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adminClients", JSON.stringify(clients));
  }, [clients]);

  const addClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Name and Email are required");
      return;
    }
    if (!newClient.mispEventTitle || !newClient.mispApiKey) {
      toast.error("MISP Event Title and API Key are required");
      return;
    }

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
      setClients([...clients, { id, ...newClient }]);

      setNewClient({
        name: "",
        email: "",
        mispEventTitle: "",
        mispEventTags: "",
        mispApiKey: "",
      });

      toast.success(data?.message || "Client added!");
    } catch (err) {
      console.error(err);
      toast.error("Network error while adding client");
    }
  };

  const deleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id));
    toast.success("Client deleted!");
  };

  const startEdit = (client) => {
    setEditingId(client.id);
    setNewClient({ ...client });
  };

  const saveEdit = () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Name and Email are required");
      return;
    }
    setClients(
      clients.map((c) =>
        c.id === editingId ? { id: c.id, ...newClient } : c
      )
    );
    setEditingId(null);
    setNewClient({
      name: "",
      email: "",
      mispEventTitle: "",
      mispEventTags: "",
      mispApiKey: "",
    });
    toast.success("Client updated!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewClient({
      name: "",
      email: "",
      mispEventTitle: "",
      mispEventTags: "",
      mispApiKey: "",
    });
  };

  return (
    <div className="space-y-8">
      {/* Create/Edit Client */}
      <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {editingId ? "Edit Client" : "Create New Client"}
        </h2>

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
