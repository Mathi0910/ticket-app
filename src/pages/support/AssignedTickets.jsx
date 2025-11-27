// src/pages/support/AssignedTickets.jsx
import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AssignedTickets() {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await ticketService.getAll();
        const assigned = data.filter(t => {
          // try id/email matching
          return t.assignedTo === user?.id || t.assignedTo === user?.email || t.AssignedTo === user?.Id || t.AssignedTo === user?.Email;
        });
        setTickets(assigned.length ? assigned : data.filter(t => t.assignedTo));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Assigned Tickets</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tickets.map(t => (
          <li key={t.ticketId ?? t.TicketId} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
            <div><strong>{t.title ?? t.Title}</strong></div>
            <div>Status: {t.status ?? t.Status}</div>
            <div><Link to={`/agent/tickets/${t.ticketId ?? t.TicketId}`}>Open</Link></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
