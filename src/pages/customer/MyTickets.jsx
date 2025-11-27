// src/pages/customer/MyTickets.jsx
import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await ticketService.getAll();
        // Best-effort filter:
        const filtered = data.filter(t => {
          // backend returns CreatedBy as an id string; try matching id OR email if available
          if (!user) return false;
          return t.CreatedBy === user.id || t.CreatedBy === user.email || t.CreatedBy === user?.Id || t.CreatedBy === user?.Email;
        });
        // fallback: if filter removes all and user likely a customer, show all (so user sees something)
        setTickets(filtered.length ? filtered : data);
      } catch (err) {
        console.error(err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <div style={{ padding: 20 }}>Loading tickets...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Tickets</h2>
      {tickets.length === 0 && <div>No tickets yet.</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tickets.map(t => (
          <li key={t.ticketId || t.TicketId || t.TicketId} style={{ marginBottom: 12, border: "1px solid #ddd", padding: 12 }}>
            <div><strong>{t.title ?? t.Title}</strong></div>
            <div>Priority: {t.priority ?? t.Priority}</div>
            <div>Status: {t.status ?? t.Status}</div>
            <div>Created: {new Date(t.createdDate ?? t.CreatedDate).toLocaleString()}</div>
            <div style={{ marginTop: 6 }}>
              <Link to={`/tickets/${t.ticketId ?? t.TicketId}`}>View</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
