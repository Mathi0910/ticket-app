// src/pages/customer/TicketView.jsx
// Ticket detail view that shows ticket fields, comments, and allows posting comments.
// Also allows Close action for Admin/Support.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ticketService from "../../services/ticketService";
import commentService from "../../services/commentService";

// Helper to safely read current user and role
const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
};

const TicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();
  const role = user?.role ?? user?.Role ?? null;

  useEffect(() => {
    if (!id) return;
    loadTicket();
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getById(id);
      setTicket(data);
    } catch (err) {
      console.error("Failed loading ticket", err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getByTicket(id);
      setComments(data || []);
    } catch (err) {
      console.error("Failed loading comments", err);
    }
  };

  const handlePostComment = async () => {
    const trimmed = (newComment || "").trim();
    if (!trimmed) return;
    try {
      await commentService.create({ ticketId: id, message: trimmed });
      setNewComment("");
      await loadComments();
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Failed to post comment.");
    }
  };

  const canClose = role === "Admin" || role === "Support" || role === "admin" || role === "support";

  const handleClose = async () => {
    if (!ticket) return;
    if (!confirm("Close this ticket? This action will set status to Closed.")) return;
    try {
      await ticketService.update(id, { status: "Closed" });
      await loadTicket();
      await loadComments();
    } catch (err) {
      console.error("Failed to close", err);
      alert("Failed to close ticket.");
    }
  };

  if (loading) return <div>Loading ticket...</div>;
  if (!ticket) return <div>No ticket found</div>;

  // defensive property access
  const title = ticket.title ?? ticket.Title ?? "(No title)";
  const description = ticket.description ?? ticket.Description ?? "";
  const priority = ticket.priority ?? ticket.Priority ?? "";
  const status = ticket.status ?? ticket.Status ?? "";
  const createdBy = ticket.createdByName ?? ticket.CreatedByName ?? ticket.createdBy ?? ticket.CreatedBy ?? "Unknown";
  const assignedTo = ticket.assignedToName ?? ticket.AssignedToName ?? ticket.assignedTo ?? ticket.AssignedTo ?? "Unassigned";
  const createdDate = ticket.createdDate ?? ticket.CreatedDate ?? ticket.createdOn ?? ticket.CreatedOn ?? "";

  return (
    <div>
      <h2>{title}</h2>
      <div>
        <div><strong>Priority:</strong> {priority}</div>
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Created by:</strong> {createdBy}</div>
        <div><strong>Assigned to:</strong> {assignedTo}</div>
        <div><strong>Created:</strong> {createdDate}</div>
      </div>

      <hr />
      <div>
        <h3>Description</h3>
        <div>{description}</div>
      </div>

      <hr />
      <div>
        <h3>Comments</h3>
        {Array.isArray(comments) && comments.length > 0 ? (
          <div>
            {comments.map((c) => {
              const msg = c.message ?? c.Message ?? "";
              const author = c.createdByName ?? c.CreatedByName ?? c.userName ?? c.UserName ?? "Unknown";
              const when = c.createdAt ?? c.CreatedAt ?? c.createdDate ?? c.CreatedDate ?? "";
              return (
                <div key={c.id ?? c.commentId ?? JSON.stringify(c)}>
                  <div><strong>{author}</strong> <small>{when}</small></div>
                  <div>{msg}</div>
                  <hr />
                </div>
              );
            })}
          </div>
        ) : (
          <div>No comments yet.</div>
        )}

        <div style={{ marginTop: 8 }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: 6 }}>
            <button onClick={handlePostComment}>Post comment</button>
            {canClose && <button onClick={handleClose} style={{ marginLeft: 8 }}>Close Ticket</button>}
            <button onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketView;


// // src/pages/customer/TicketView.jsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ticketService from "../../services/ticketService";
// import commentService from "../../services/commentService";
// import { useAuth } from "../../contexts/AuthContext";

// export default function TicketView() {
//   const { id } = useParams();
//   const [ticket, setTicket] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const { user } = useAuth();

//   useEffect(() => {
//     (async () => {
//       try {
//         const t = await ticketService.getById(id);
//         setTicket(t);
//       } catch (err) {
//         console.error(err);
//       }
//       try {
//         const c = await commentService.getByTicket(id);
//         setComments(c);
//       } catch (err) {}
//     })();
//   }, [id]);

//   const submitComment = async (e) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;
//     try {
//       await commentService.create({ ticketId: Number(id), message: newComment });
//       const c = await commentService.getByTicket(id);
//       setComments(c);
//       setNewComment("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const closeIfAllowed = async () => {
//     // customers can close only if status == Resolved (backend enforces)
//     try {
//       await ticketService.update(id, { status: "Closed" });
//       const t = await ticketService.getById(id);
//       setTicket(t);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (!ticket) return <div style={{ padding: 20 }}>Loading ticket...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>{ticket.title ?? ticket.Title}</h2>
//       <div>{ticket.description ?? ticket.Description}</div>
//       <div>Priority: {ticket.priority ?? ticket.Priority}</div>
//       <div>Status: {ticket.status ?? ticket.Status}</div>
//       <div>Created: {new Date(ticket.createdDate ?? ticket.CreatedDate).toLocaleString()}</div>

//       <hr style={{ margin: "12px 0" }} />
//       <h3>Comments</h3>
//       {comments.length === 0 && <div>No comments yet.</div>}
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {comments.map(c => (
//           <li key={c.commentId ?? c.CommentId} style={{ marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
//             <div>{c.message ?? c.Message}</div>
//             <small>{new Date(c.createdDate ?? c.CreatedDate).toLocaleString()}</small>
//           </li>
//         ))}
//       </ul>

//       <form onSubmit={submitComment} style={{ marginTop: 12 }}>
//         <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} style={{ width: "100%", padding: 8 }} />
//         <button style={{ marginTop: 8 }}>Add Comment</button>
//       </form>

//       {ticket.status === "Resolved" || ticket.Status === "Resolved" ? (
//         <div style={{ marginTop: 12 }}>
//           <button onClick={closeIfAllowed}>Close Ticket</button>
//         </div>
//       ) : null}
//     </div>
//   );
// }
