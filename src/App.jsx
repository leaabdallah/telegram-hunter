import React from "react";
import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
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
import AdminClients from "./pages/admin/AdminClients";

// Admin
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminSystemLogs from "./pages/admin/AdminSystemLogs";
import AdminAlertManagement from "./pages/admin/AdminAlertManagement";
import AdminLeakHunter from "./pages/admin/AdminLeakHunter";

const PrivateRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  return isAuth ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

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
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
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
    </Router>
  );
};

export default App;
