// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const result = await login(form);
    if (!result.ok) {
      setError(result.error || "Invalid email or password");
      return;
    }
    navigate("/dashboard");
  } catch (err) {
    setError("Unexpected error");
  }
};


  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, borderRadius: 8, width: 360 }}>
        <h2 style={{ marginBottom: 12 }}>Login</h2>

        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          style={{ width: "100%", padding: 8, marginBottom: 12 }}
        />

        <button type="submit" style={{ width: "100%", padding: 10 }}>Login</button>

        <p style={{ marginTop: 12 }}>
          Don’t have an account? <Link to="/auth/register">Register</Link>
        </p>
      </form>
    </div>
  );
}