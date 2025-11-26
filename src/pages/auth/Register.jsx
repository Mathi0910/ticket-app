// src/pages/auth/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Customer" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await register(form);
    if (!result.ok) {
      setError(result.error || "Registration failed");
      return;
    }
    navigate("/auth/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, borderRadius: 8, width: 360 }}>
        <h2 style={{ marginBottom: 12 }}>Register</h2>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <input name="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 12 }} />

        <input name="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 12 }} />

        <input type="password" name="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 12 }} />

        <select name="role" value={form.role} onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 12 }}>
          <option value="Customer">Customer</option>
          <option value="Support">Support</option>
        </select>

        <button type="submit" style={{ width: "100%", padding: 10 }}>Register</button>

        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
