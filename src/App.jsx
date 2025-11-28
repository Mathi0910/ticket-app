// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

/* pages (import only what you need) */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/customer/CreateTicket";
import MyTickets from "./pages/customer/MyTickets";
import TicketView from "./pages/customer/TicketView";
import AssignedTickets from "./pages/support/AssignedTickets";
import TicketWork from "./pages/support/TicketWork";
import AllTickets from "./pages/admin/AllTickets";
import AssignTicket from "./pages/admin/AssignTicket";
import ManageUsers from "./pages/admin/ManageUSers";

/* PrivateRoute and RoleGuard */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
}
function RoleGuard({ allowed = [], children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
function DashboardRouter() {
  const { user } = useAuth();
  const local = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const rawUser = user ?? (local ? JSON.parse(local) : null);
  if (!rawUser) return <Navigate to="/auth/login" replace />;
  const role = rawUser.role || rawUser.Role;
  if (role === "Admin") return <Navigate to="/admin/tickets" replace />;
if (role === "Support") return <Navigate to="/agent/tickets" replace />;
return <Navigate to="/dashboard" replace />;

}

export default function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />


      {/* customer */}
      <Route path="/tickets" element={<PrivateRoute><RoleGuard allowed={["Customer"]}><MyTickets/></RoleGuard></PrivateRoute>} />
      <Route path="/tickets/create" element={<PrivateRoute><RoleGuard allowed={["Customer","Support","Admin"]}><CreateTicket/></RoleGuard></PrivateRoute>} />

      <Route path="/tickets/:id" element={<PrivateRoute><TicketView/></PrivateRoute>} />

      {/* support */}
      <Route path="/agent/tickets" element={<PrivateRoute><RoleGuard allowed={["Support"]}><AssignedTickets/></RoleGuard></PrivateRoute>} />
      <Route path="/agent/tickets/:id" element={<PrivateRoute><RoleGuard allowed={["Support"]}><TicketWork/></RoleGuard></PrivateRoute>} />

      {/* admin */}
      <Route path="/admin/tickets" element={<PrivateRoute><RoleGuard allowed={["Admin"]}><AllTickets/></RoleGuard></PrivateRoute>} />
      <Route path="/admin/tickets/:id/assign" element={<PrivateRoute><RoleGuard allowed={["Admin"]}><AssignTicket/></RoleGuard></PrivateRoute>} />
      <Route path="/admin/users" element={<PrivateRoute><RoleGuard allowed={["Admin"]}><ManageUsers/></RoleGuard></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<div style={{ padding: 20 }}>404 — Page not found</div>} />
    </Routes>
  );
}