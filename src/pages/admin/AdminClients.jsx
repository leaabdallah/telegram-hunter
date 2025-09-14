import React, { useState, useEffect } from "react";

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    mispEventTitle: "",
    mispApiKey: "",
  });
  const [editingClient, setEditingClient] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Load clients from localStorage
    const storedClients = JSON.parse(localStorage.getItem("clients")) || [];
    setClients(storedClients);
  }, []);

  const saveClients = (updatedClients) => {
    setClients(updatedClients);
    localStorage.setItem("clients", JSON.stringify(updatedClients));
  };

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const addClient = (e) => {
    e.preventDefault();
    if (
      !newClient.name.trim() ||
      !newClient.email.trim() ||
      !newClient.mispEventTitle.trim() ||
      !newClient.mispApiKey.trim()
    ) {
      alert("All fields are required!");
      return;
    }

    if (editingClient) {
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? { ...newClient, id: client.id } : client
      );
      saveClients(updatedClients);
      setEditingClient(null);
    } else {
      const clientWithId = {
        ...newClient,
        id: Date.now(),
      };
      saveClients([...clients, clientWithId]);
    }

    // Reset form
    setNewClient({ name: "", email: "", mispEventTitle: "", mispApiKey: "" });
  };

  const deleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      const updatedClients = clients.filter((client) => client.id !== id);
      saveClients(updatedClients);
    }
  };

  const startEdit = (client) => {
    setEditingClient(client);
    setNewClient(client);
  };

  const cancelEdit = () => {
    setEditingClient(null);
    setNewClient({ name: "", email: "", mispEventTitle: "", mispApiKey: "" });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Clients Management</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={addClient}
        className="bg-slate-800 p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">
          {editingClient ? "Edit Client" : "Add New Client"}
        </h2>
        <input
          type="text"
          name="name"
          placeholder="Client Name"
          value={newClient.name}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="email"
          name="email"
          placeholder="Client Email"
          value={newClient.email}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="text"
          name="mispEventTitle"
          placeholder="MISP Event Title"
          value={newClient.mispEventTitle}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="text"
          name="mispApiKey"
          placeholder="MISP API Key"
          value={newClient.mispApiKey}
          onChange={handleInputChange}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white"
          >
            {editingClient ? "Update Client" : "Add Client"}
          </button>

          {editingClient && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search */}
      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 rounded bg-slate-700 text-white mb-4"
      />

      {/* Clients Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-700 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">MISP Event Title</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-700">
                <td className="py-2">{client.id}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.mispEventTitle}</td>
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
