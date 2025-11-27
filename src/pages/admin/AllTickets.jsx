// src/pages/admin/AllTickets.jsx
import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import { Link } from "react-router-dom";

export default function AllTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await ticketService.getAll();
        setTickets(data);
      } catch (err) { console.error(err); }
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Tickets</h2>
      <Link to="/admin/tickets/new" style={{ marginBottom: 12, display: "inline-block" }}>Create</Link>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tickets.map(t => (
          <li key={t.ticketId ?? t.TicketId} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
            <div><strong>{t.title ?? t.Title}</strong></div>
            <div>CreatedBy: {t.createdBy ?? t.CreatedBy}</div>
            <div>AssignedTo: {t.assignedTo ?? t.AssignedTo}</div>
            <div>Status: {t.status ?? t.Status}</div>
            <div><Link to={`/admin/tickets/${t.ticketId ?? t.TicketId}/assign`}>Assign / View</Link></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
