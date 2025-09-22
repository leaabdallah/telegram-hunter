import React from "react";
import { Toaster } from "sonner";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import LeakHunter from "./pages/LeakHunter";
import Settings from "./pages/Settings";
import LoginPage from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";

// Admin
import AdminClients from "./pages/admin/AdminClients";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSystemLogs from "./pages/admin/AdminSystemLogs";
import AdminAlertManagement from "./pages/admin/AdminAlertManagement";
import AdminLeakHunter from "./pages/admin/AdminLeakHunter";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminProfileSettings from "./pages/admin/AdminProfileSettings";

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  return isAuth ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPass />} />

        {/* User Protected */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="alerts"
            element={
              <PrivateRoute>
                <Alerts />
              </PrivateRoute>
            }
          />
          <Route
            path="leak-hunter"
            element={
              <PrivateRoute>
                <LeakHunter />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Routes for Navbar dropdown */}
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="profile-settings"
            element={
              <PrivateRoute>
                <ProfileSettings />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="profile-settings" element={<AdminProfileSettings />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="logs" element={<AdminSystemLogs />} />
          <Route path="alerts" element={<AdminAlertManagement />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="LeakHunter" element={<AdminLeakHunter />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
