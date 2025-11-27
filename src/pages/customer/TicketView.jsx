// src/pages/customer/TicketView.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ticketService from "../../services/ticketService";
import commentService from "../../services/commentService";
import { useAuth } from "../../contexts/AuthContext";

export default function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const t = await ticketService.getById(id);
        setTicket(t);
      } catch (err) {
        console.error(err);
      }
      try {
        const c = await commentService.getByTicket(id);
        setComments(c);
      } catch (err) {}
    })();
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await commentService.create({ ticketId: Number(id), message: newComment });
      const c = await commentService.getByTicket(id);
      setComments(c);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const closeIfAllowed = async () => {
    // customers can close only if status == Resolved (backend enforces)
    try {
      await ticketService.update(id, { status: "Closed" });
      const t = await ticketService.getById(id);
      setTicket(t);
    } catch (err) {
      console.error(err);
    }
  };

  if (!ticket) return <div style={{ padding: 20 }}>Loading ticket...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{ticket.title ?? ticket.Title}</h2>
      <div>{ticket.description ?? ticket.Description}</div>
      <div>Priority: {ticket.priority ?? ticket.Priority}</div>
      <div>Status: {ticket.status ?? ticket.Status}</div>
      <div>Created: {new Date(ticket.createdDate ?? ticket.CreatedDate).toLocaleString()}</div>

      <hr style={{ margin: "12px 0" }} />
      <h3>Comments</h3>
      {comments.length === 0 && <div>No comments yet.</div>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {comments.map(c => (
          <li key={c.commentId ?? c.CommentId} style={{ marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <div>{c.message ?? c.Message}</div>
            <small>{new Date(c.createdDate ?? c.CreatedDate).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={submitComment} style={{ marginTop: 12 }}>
        <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} style={{ width: "100%", padding: 8 }} />
        <button style={{ marginTop: 8 }}>Add Comment</button>
      </form>

      {ticket.status === "Resolved" || ticket.Status === "Resolved" ? (
        <div style={{ marginTop: 12 }}>
          <button onClick={closeIfAllowed}>Close Ticket</button>
        </div>
      ) : null}
    </div>
  );
}
