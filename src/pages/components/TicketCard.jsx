// src/pages/components/TicketCard.jsx
import React from "react";
import "./../../pages/Dashboard.css"; // uses same stylesheet for simplicity

export default function TicketCard({ ticket }) {
  const id = ticket.ticketId ?? ticket.id ?? "—";
  const title = ticket.title ?? ticket.Title ?? "Untitled";
  const priority = ticket.priority ?? ticket.Priority ?? "Medium";
  const status = ticket.status ?? ticket.Status ?? "New";
  const created = ticket.createdDate ?? ticket.createdDate ?? ticket.CreatedDate ?? "";

  return (
    <article className="ticket-card" role="article" aria-labelledby={`t-${id}`}>
      <div className="ticket-left">
        <h4 id={`t-${id}`} className="ticket-title">{title}</h4>
        <div className="ticket-meta">
          <span className={`priority priority-${priority.toLowerCase()}`}>{priority}</span>
          <span className={`status status-${status.toLowerCase().replace(/\s+/g, "-")}`}>{status}</span>
          <span className="created">{created ? new Date(created).toLocaleString() : ""}</span>
        </div>
      </div>
      <div className="ticket-actions">
        <button className="btn-link">View</button>
      </div>
    </article>
  );
}
