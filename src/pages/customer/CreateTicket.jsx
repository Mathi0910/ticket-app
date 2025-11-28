// src/pages/customer/CreateTicket.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ticketService from "../../services/ticketService";
import { useAuth } from "../../contexts/AuthContext";
import "../../pages/Dashboard.css"; // reuse dashboard CSS for quick styling

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // basic validation
    if (!form.title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!form.description.trim()) {
      setError("Please add a brief description.");
      return;
    }

    setLoading(true);
    try {
      // API expects CreateTicketDto: { Title, Description, Priority } or camelCase
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
      };

      await ticketService.create(payload); // returns created ticket
      // After successful create, go to tickets list (or dashboard)
      navigate("/tickets");
    } catch (err) {
      console.error("Create ticket failed", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data ||
        err?.message ||
        "Failed to create ticket";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-root">
      <header className="dash-header">
        <div className="dash-brand">
          <h1>Create Ticket</h1>
          <div className="dash-sub">Raising a new support ticket</div>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "28px auto", padding: "0 18px" }}>
        <div style={{ background: "var(--card)", padding: 20, borderRadius: 12, boxShadow: "var(--shadow)" }}>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Unable to login"
              style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, border: "1px solid #e6e6e6" }}
            />

            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              rows={6}
              style={{ width: "100%", padding: 10, marginBottom: 12, borderRadius: 8, border: "1px solid #e6e6e6" }}
            />

            <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} style={{ padding: 8, borderRadius: 8, marginBottom: 18 }}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: 140 }}>
                {loading ? "Creating..." : "Create Ticket"}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate(-1)}
                style={{ minWidth: 120 }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
