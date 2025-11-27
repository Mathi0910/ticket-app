// src/pages/customer/CreateTicket.jsx
import React, { useState } from "react";
import ticketService from "../../services/ticketService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateTicket() {
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // backend expects CreateTicketDto { Title, Description, Priority }
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority
      };
      await ticketService.create(payload);
      navigate("/tickets");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Create ticket failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Ticket</h2>
      {user && <div style={{ marginBottom: 8 }}>Submitting as: {user.email} ({user.role})</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={submit} style={{ maxWidth: 720 }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: "100%", padding: 8, marginBottom: 8 }} rows={6} />
        <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} style={{ padding: 8, marginBottom: 12 }}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <div>
          <button type="submit" style={{ padding: "8px 16px" }}>Create</button>
        </div>
      </form>
    </div>
  );
}
