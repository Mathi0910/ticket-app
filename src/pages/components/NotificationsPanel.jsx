// src/components/NotificationsPanel.jsx
import React from "react";
import { useNotifications } from "../contexts/NotificationContext";

export default function NotificationsPanel() {
  const { notifications, markSeen } = useNotifications();

  if (!notifications.length) {
    return <div>No notifications</div>;
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Notifications</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.map(n => (
          <li key={n.id} style={{ marginBottom: 10, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{n.title}</strong>
              <button onClick={() => markSeen(n.id)} style={{ fontSize: 12 }}>{n.seen ? "Seen" : "Mark seen"}</button>
            </div>
            <div style={{ fontSize: 13 }}>{n.message}</div>
            <div style={{ fontSize: 11, color: "#666" }}>{new Date(n.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
