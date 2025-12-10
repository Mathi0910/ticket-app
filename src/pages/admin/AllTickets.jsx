// src/pages/admin/AllTickets.jsx
// Admin listing of all tickets with ability to assign and close tickets.
// No CSS included; minimal inline appearance.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../../services/ticketService";
import userService from "../../services/userService";

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assigning, setAssigning] = useState({}); // { [ticketId]: assignedToId }

  useEffect(() => {
    loadTickets();
    loadUsers();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await ticketService.getAll();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load tickets", err);
      alert("Failed to load tickets.");
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleAssignChange = (ticketId, value) => {
    setAssigning((prev) => ({ ...prev, [ticketId]: value }));
  };

  const handleAssignSave = async (ticketId) => {
    const assignedToId = assigning[ticketId];
    if (!assignedToId) {
      alert("Choose a user to assign.");
      return;
    }
    try {
      await ticketService.update(ticketId, { assignedToId });
      await loadTickets();
      alert("Assigned successfully.");
    } catch (err) {
      console.error("Failed assign", err);
      alert("Failed to assign ticket.");
    }
  };

  const handleClose = async (ticketId) => {
    if (!confirm("Close this ticket?")) return;
    try {
      await ticketService.update(ticketId, { status: "Closed" });
      await loadTickets();
      alert("Ticket closed.");
    } catch (err) {
      console.error("Failed to close", err);
      alert("Failed to close ticket.");
    }
  };

  return (
    <div>
      <h2>All Tickets (Admin)</h2>

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
              <label>
                Assign to:
                <select
                  style={{ marginLeft: 8 }}
                  value={assigning[tid] ?? ""}
                  onChange={(e) => handleAssignChange(tid, e.target.value)}
                >
                  <option value="">--select--</option>
                  {users.map((u) => {
                    const uid = u.id ?? u.userId ?? u.Id ?? u.UserId;
                    const name = u.displayName ?? u.name ?? u.userName ?? u.UserName ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`;
                    return <option key={uid} value={uid}>{name}</option>;
                  })}
                </select>
              </label>
              <button onClick={() => handleAssignSave(tid)} style={{ marginLeft: 8 }}>Save</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllTickets;

// // src/pages/admin/AllTickets.jsx
// import React, { useEffect, useState } from "react";
// import ticketService from "../../services/ticketService";
// import { Link } from "react-router-dom";

// export default function AllTickets() {
//   const [tickets, setTickets] = useState([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await ticketService.getAll();
//         setTickets(data);
//       } catch (err) { console.error(err); }
//     })();
//   }, []);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>All Tickets</h2>
//       <Link to="/admin/tickets/new" style={{ marginBottom: 12, display: "inline-block" }}>Create</Link>
//       <ul style={{ listStyle: "none", padding: 0 }}>
//         {tickets.map(t => (
//           <li key={t.ticketId ?? t.TicketId} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
//             <div><strong>{t.title ?? t.Title}</strong></div>
//             <div>CreatedBy: {t.createdBy ?? t.CreatedBy}</div>
//             <div>AssignedTo: {t.assignedTo ?? t.AssignedTo}</div>
//             <div>Status: {t.status ?? t.Status}</div>
//             <div><Link to={`/admin/tickets/${t.ticketId ?? t.TicketId}/assign`}>Assign / View</Link></div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
