// src/pages/support/AssignedTickets.jsx
// Support view: shows ordered tickets (priority first). Support can comment and close.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../../services/ticketService";
import commentService from "../../services/commentService";

const AssignedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [commentText, setCommentText] = useState({}); // map ticketId -> text
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrdered();
  }, []);

  const loadOrdered = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getOrdered();
      // If backend doesn't return ordered, fallback to sorting client-side
      let arr = Array.isArray(data) ? data : [];
      if (!arr.length) {
        const all = await ticketService.getAll();
        arr = Array.isArray(all) ? all : [];
      }

      // normalize priority sorting: High -> Medium -> Low
      const priorityOrder = { High: 3, high: 3, MEDIUM: 2, Medium: 2, medium: 2, Low: 1, low: 1 };
      arr.sort((a, b) => (priorityOrder[b.priority ?? b.Priority] || 0) - (priorityOrder[a.priority ?? a.Priority] || 0));
      setTickets(arr);
    } catch (err) {
      console.error("Failed to load ordered tickets", err);
      alert("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (ticketId) => {
    const text = (commentText[ticketId] || "").trim();
    if (!text) return;
    try {
      await commentService.create({ ticketId, message: text });
      setCommentText((s) => ({ ...s, [ticketId]: "" }));
      alert("Comment added.");
    } catch (err) {
      console.error("Failed to post comment", err);
      alert("Failed to post comment.");
    }
  };

  const handleClose = async (ticketId) => {
    if (!confirm("Close this ticket?")) return;
    try {
      await ticketService.update(ticketId, { status: "Closed" });
      await loadOrdered();
      alert("Ticket closed.");
    } catch (err) {
      console.error("Failed to close", err);
      alert("Failed to close ticket.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Assigned Tickets (Support)</h2>

      {tickets.length === 0 && <div>No tickets found.</div>}

      {tickets.map((t) => {
        const tid = t.id ?? t.ticketId ?? t.Id ?? t.TicketId;
        const title = t.title ?? t.Title ?? "(no title)";
        const priority = t.priority ?? t.Priority ?? "";
        const status = t.status ?? t.Status ?? "";
        const assignedToName = t.assignedToName ?? t.AssignedToName ?? t.assignedTo ?? t.AssignedTo ?? "Unassigned";

        return (
          <div key={tid} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12, borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ margin: 0 }}>{title}</h4>
                <div>
                  <small>Priority: {priority} | Status: {status} | Assigned: {assignedToName}</small>
                </div>
              </div>
              <div>
                <Link to={`/tickets/${tid}`}><button>View</button></Link>
                <button onClick={() => handleClose(tid)} style={{ marginLeft: 8 }}>Close</button>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <textarea
                placeholder="Write a comment..."
                value={commentText[tid] ?? ""}
                onChange={(e) => setCommentText((s) => ({ ...s, [tid]: e.target.value }))}
                rows={3}
                style={{ width: "100%" }}
              />
              <div style={{ marginTop: 6 }}>
                <button onClick={() => handlePostComment(tid)}>Add Comment</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignedTickets;
// // src/pages/support/AssignedTickets.jsx
// import React, { useEffect, useState } from "react";
// import ticketService from "../../services/ticketService";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";

// export default function AssignedTickets() {
//   const [tickets, setTickets] = useState([]);
//   const { user } = useAuth();

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await ticketService.getAll();
//         const assigned = data.filter(t => {
//           // try id/email matching
//           return t.assignedTo === user?.id || t.assignedTo === user?.email || t.AssignedTo === user?.Id || t.AssignedTo === user?.Email;
//         });
//         setTickets(assigned.length ? assigned : data.filter(t => t.assignedTo));
//       } catch (err) {
//         console.error(err);
//       }
//     })();
//   }, [user]);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Assigned Tickets</h2>
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {tickets.map(t => (
//           <li key={t.ticketId ?? t.TicketId} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
//             <div><strong>{t.title ?? t.Title}</strong></div>
//             <div>Status: {t.status ?? t.Status}</div>
//             <div><Link to={`/agent/tickets/${t.ticketId ?? t.TicketId}`}>Open</Link></div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
