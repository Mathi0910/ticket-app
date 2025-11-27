// src/pages/admin/ManageUsers.jsx
import React, { useEffect, useState } from "react";
import userService from "../../services/userService";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const u = await userService.getAll();
        setUsers(u || []);
      } catch (err) { console.error(err); }
    })();
  }, []);

  const toggle = async (u) => {
    try {
      await userService.updateStatus(u.id ?? u.Id, !u.isActive && !u.IsActive ? true : !(u.isActive ?? u.IsActive));
      // refresh
      const fresh = await userService.getAll();
      setUsers(fresh || []);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Users</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Email</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Role</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Active</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id ?? u.Id}>
              <td style={{ padding: 8 }}>{u.name ?? u.Name}</td>
              <td>{u.email ?? u.Email}</td>
              <td>{u.role ?? u.Role}</td>
              <td>{(u.isActive ?? u.IsActive) ? "Yes" : "No"}</td>
              <td><button onClick={() => toggle(u)}>{(u.isActive ?? u.IsActive) ? "Deactivate" : "Activate"}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
