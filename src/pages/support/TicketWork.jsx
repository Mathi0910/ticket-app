// src/pages/support/TicketWork.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ticketService from "../../services/ticketService";
import commentService from "../../services/commentService";

export default function TicketWork() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const t = await ticketService.getById(id);
        setTicket(t);
        setStatus(t.status ?? t.Status);
      } catch (err) { console.error(err); }
      try {
        const c = await commentService.getByTicket(id);
        setComments(c);
      } catch (err) {}
    })();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await ticketService.update(id, { status: newStatus });
      const t = await ticketService.getById(id);
      setTicket(t);
      setStatus(t.status ?? t.Status);
    } catch (err) { console.error(err); }
  };

  if (!ticket) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Work: {ticket.title ?? ticket.Title}</h2>
      <div>{ticket.description ?? ticket.Description}</div>
      <div style={{ margin: "12px 0" }}>
        <strong>Status:</strong> {status}
      </div>

      <div>
        {status !== "InProgress" && <button onClick={() => updateStatus("InProgress")} style={{ marginRight: 8 }}>Set In Progress</button>}
        {status !== "Resolved" && <button onClick={() => updateStatus("Resolved")}>Set Resolved</button>}
      </div>

      <hr style={{ margin: "12px 0" }} />
      <h3>Comments</h3>
      {comments.map(c => (
        <div key={c.commentId ?? c.CommentId} style={{ borderBottom: "1px solid #eee", padding: 8 }}>
          <div>{c.message ?? c.Message}</div>
          <small>{new Date(c.createdDate ?? c.CreatedDate).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
