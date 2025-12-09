// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createNotificationConnection, startConnection, stopConnection } from "../services/signalRService";

// Replace this with your real auth token getter
import authService from "../services/authService"; // must expose getToken() or similar

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children, hubUrl = "/hubs/notifications" }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]); // ephemeral toast pieces

  const addNotification = useCallback((n) => {
    setNotifications(prev => [n, ...prev]);
    // add toast
    const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    setToasts(t => [{ id, ...n }, ...t]);
    // auto remove toast after 5s
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    const conn = createNotificationConnection({
      hubUrl,
      getJwtToken: async () => {
        // adapt to your authService method
        if (authService && typeof authService.getToken === "function") {
          return await authService.getToken();
        }
        // if your auth token is in localStorage:
        return localStorage.getItem("token");
      },
      onReceive: (payload) => {
        // normalize payload quickly
        const n = {
          id: payload.notificationId ?? payload.notificationId ?? `${Date.now()}`,
          title: payload.title ?? "Notification",
          message: payload.message ?? JSON.stringify(payload),
          createdAt: payload.createdAt ? new Date(payload.createdAt) : new Date()
        };
        addNotification(n);
      }
    });

    // start connection
    startConnection().catch(err => console.error("SignalR start error:", err));

    return () => {
      // stop on unmount
      stopConnection();
    };
  }, [addNotification, hubUrl]);

  const markSeen = (id) => {
    // optionally call /api/notifications/{id}/seen
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, seen: true } : n));
  };

  const value = {
    notifications,
    toasts,
    markSeen,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationToastLayer toasts={toasts} />
    </NotificationContext.Provider>
  );
}

// small Toast layer component
function NotificationToastLayer({ toasts }) {
  return (
    <div style={layerStyle}>
      {toasts.map(t => (
        <div key={t.id} style={toastStyle}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
          <div style={{ fontSize: 13 }}>{t.message}</div>
          <div style={{ fontSize: 11, marginTop: 6, opacity: 0.8 }}>{formatDate(t.createdAt)}</div>
        </div>
      ))}
    </div>
  );
}

const layerStyle = {
  position: "fixed",
  top: 16,
  right: 16,
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  maxWidth: 360
};

const toastStyle = {
  background: "white",
  border: "1px solid rgba(0,0,0,0.08)",
  padding: "10px 14px",
  borderRadius: 10,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
};

function formatDate(d) {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleString();
}
