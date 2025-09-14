import React, { useState, useEffect } from "react";
import { toast } from "sonner";

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
      return;
    }

    // Validate email
    if (!isValidEmail(newClient.email)) {
      toast.error("Invalid email format!");
      return;
    }

    const id = clients.length + 1;
    setClients([...clients, { id, ...newClient }]);
    setNewClient({ name: "", email: "", mispEvent: "", apiKey: "" });

    // Reset form
    setNewClient({
      name: "",
      email: "",
      mispEventTitle: "",
      mispEventTags: "",
      mispApiKey: "",
    });

    toast.success("Client created successfully!");
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
      return;
    }

    setClients(
      clients.map((c) => (c.id === editingId ? { id: c.id, ...newClient } : c))
    );
    setEditingId(null);
    setNewClient({ name: "", email: "", mispEventTitle: "", mispApiKey: "" });

    // Reset form
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
    setNewClient({ name: "", email: "", mispEventTitle: "", mispApiKey: "" });
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
          placeholder="MISP Event Tags (comma-separated,eg.,tlp,client-tag)"
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
              <th>MISP API Key</th>
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
                <td className="text-right flex gap-2 justify-end">
                  <button
                    onClick={() => startEdit(client)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
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
