import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const AdminUsers = () => {
  // Load users from localStorage or default list
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("adminUsers");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, username: "admin", role: "Admin" },
          { id: 2, username: "analyst1", role: "Analyst" },
          { id: 3, username: "monitor1", role: "Monitor" },
        ];
  });

  const [newUser, setNewUser] = useState({ username: "", role: "Analyst" });

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("adminUsers", JSON.stringify(users));
  }, [users]);

  const addUser = () => {
    if (!newUser.username) {
      toast.error("Username is required");
      return;
    }
    const id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    setUsers([...users, { id, ...newUser }]);
    setNewUser({ username: "", role: "Analyst" });
    toast.success("User created!");
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    toast.success("User deleted!");
  };

  return (
    <div className="space-y-8">
      {/* Create User */}
      <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold text-white">Create New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
        >
          <option>Admin</option>
          <option>Analyst</option>
          <option>Monitor</option>
        </select>
        <button
          onClick={addUser}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-lg"
        >
          Add User
        </button>
      </div>

      {/* User List */}
      <div className="bg-gray-800 rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold text-white">Manage Users</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-gray-600">
              <th className="py-2">ID</th>
              <th>Username</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-700">
                <td className="py-2">{u.id}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td className="text-right">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-slate-400 py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
