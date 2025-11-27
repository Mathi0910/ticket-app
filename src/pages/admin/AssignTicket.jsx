// src/pages/admin/AssignTicket.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ticketService from "../../services/ticketService";
import userService from "../../services/userService";

export default function AssignTicket() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const t = await ticketService.getById(id);
        setTicket(t);
        const u = await userService.getAll();
        setUsers(u || []);
      } catch (err) { console.error(err); }
    })();
  }, [id]);

  const assign = async () => {
    if (!selected) return;
    try {
      await ticketService.update(id, { assignedToId: selected });
      navigate("/admin/tickets");
    } catch (err) { console.error(err); }
  };

  if (!ticket) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Assign Ticket: {ticket.title ?? ticket.Title}</h2>
      <div style={{ marginBottom: 12 }}>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={{ padding: 8 }}>
          <option value="">-- choose agent --</option>
          {users.filter(u => u.role === "Support" || u.Role === "Support").map(u => (
            <option key={u.id ?? u.Id} value={u.id ?? u.Id}>{u.name ?? u.Name} ({u.email ?? u.Email})</option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={assign} style={{ padding: "8px 12px" }}>Assign</button>
      </div>
    </div>
  );
}
