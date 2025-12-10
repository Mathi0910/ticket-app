// src/pages/customer/MyTickets.jsx
/* debug: this should make the whole page background pink if the file is loaded */


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
          if (!user) return false;
          return (
            t.CreatedBy === user.id ||
            t.CreatedBy === user.email ||
            t.CreatedBy === user?.Id ||
            t.CreatedBy === user?.Email
          );
        });
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
    <div className="tickets-page">
      <div>
        <div className="page-header">
          <h1>My Tickets</h1>
          <div>
            <button className="btn-primary">Create Ticket</button>
          </div>
        </div>

        <div className="tickets-list">
          {tickets.length === 0 && <div className="empty-state">No tickets yet.</div>}

          {tickets.map(t => {
            const id = t.ticketId ?? t.TicketId ?? t.id ?? t.Id;
            const title = t.title ?? t.Title ?? "(no title)";
            const priority = (t.priority ?? t.Priority ?? "Low").toString().toLowerCase();
            const status = t.status ?? t.Status ?? "New";
            const createdRaw = t.createdDate ?? t.CreatedDate ?? t.createdOn ?? t.CreatedOn;
            const created = createdRaw ? new Date(createdRaw).toLocaleString() : "";

            // priority badge class helper
            const priorityCls =
              priority.includes("high") ? "badge priority-high" :
              priority.includes("med") ? "badge priority-medium" : "badge priority-low";

            return (
                     <div key={id} className="ticket-card">
                     {/* temporary inline style (immediate effect; remove when CSS fixed) */}
                      <div className="ticket-info">
                     <div className="ticket-title">{title}</div>

                     <div className="ticket-meta">
                    <div className={priorityCls}>{(t.priority ?? t.Priority ?? "Low")}</div>
                    <div className="badge status">{status}</div>
                    <div className="ticket-date">{created}</div>
                  </div>
                </div>

                <div className="ticket-actions">
                  <Link to={`/tickets/${id}`}><button className="btn-view">View</button></Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="side-column">
        <div className="summary-card">
          <h3>Summary</h3>
          {/* lightweight summary counts - these are placeholders,
              you can plug in reportService.getSummary() values */}
          <div className="summary-row">
            <div>New</div>
            <div className="pill-count">2</div>
          </div>
          <div className="summary-row">
            <div>In Progress</div>
            <div className="pill-count">0</div>
          </div>
          <div className="summary-row">
            <div>Resolved</div>
            <div className="pill-count">0</div>
          </div>
          <div className="summary-row">
            <div>Closed</div>
            <div className="pill-count">1</div>
          </div>

          <div className="summary-total">
            <div>Total tickets</div>
            <div><strong>4</strong></div>
          </div>
        </div>

        <div className="help-card">
          <h4>Need help?</h4>
          <p>Contact support or create a new ticket describing the issue.</p>
          <button className="btn-contact">Contact support</button>
        </div>
      </aside>
    </div>
  );
}
// // src/pages/customer/MyTickets.jsx
// import React, { useEffect, useState } from "react";
// import ticketService from "../../services/ticketService";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";

// export default function MyTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const data = await ticketService.getAll();
//         // Best-effort filter:
//         const filtered = data.filter(t => {
//           // backend returns CreatedBy as an id string; try matching id OR email if available
//           if (!user) return false;
//           return t.CreatedBy === user.id || t.CreatedBy === user.email || t.CreatedBy === user?.Id || t.CreatedBy === user?.Email;
//         });
//         // fallback: if filter removes all and user likely a customer, show all (so user sees something)
//         setTickets(filtered.length ? filtered : data);
//       } catch (err) {
//         console.error(err);
//         setTickets([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [user]);

//   if (loading) return <div style={{ padding: 20 }}>Loading tickets...</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>My Tickets</h2>
//       {tickets.length === 0 && <div>No tickets yet.</div>}
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {tickets.map(t => (
//           <li key={t.ticketId || t.TicketId || t.TicketId} style={{ marginBottom: 12, border: "1px solid #ddd", padding: 12 }}>
//             <div><strong>{t.title ?? t.Title}</strong></div>
//             <div>Priority: {t.priority ?? t.Priority}</div>
//             <div>Status: {t.status ?? t.Status}</div>
//             <div>Created: {new Date(t.createdDate ?? t.CreatedDate).toLocaleString()}</div>
//             <div style={{ marginTop: 6 }}>
//               <Link to={`/tickets/${t.ticketId ?? t.TicketId}`}>View</Link>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
