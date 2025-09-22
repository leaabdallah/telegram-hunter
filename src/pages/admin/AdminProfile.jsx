// src/pages/admin/AdminProfile.jsx
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

const AdminProfile = () => {
  // Load from localStorage
  const [adminData, setAdminData] = useState(() => {
    const saved = localStorage.getItem("adminProfile");
    return saved
      ? JSON.parse(saved)
      : { name: "", email: "", role: "", currentPassword: "", newPassword: "" };
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Save only when "Save Changes" clicked
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email before saving
    if (!validateEmail(adminData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("adminProfile", JSON.stringify(adminData));
    toast.success("Profile updated successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={adminData.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1">Role</label>
          <input
            type="text"
            name="role"
            value={adminData.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          />
        </div>

        {/* Current Password */}
        <div>
          <label className="block mb-1">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={adminData.currentPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none pr-10"
            />
            <span
              type="button"
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </span>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block mb-1">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={adminData.newPassword}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none pr-10"
            />
            <span
              type="button"
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </span>
          </div>
        </div>

        {/* Save */}
        <button
          type="submit"
          className="w-full !bg-teal-500 hover:bg-blue-700 py-2 rounded font-semibold transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
