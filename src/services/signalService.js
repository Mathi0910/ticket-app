// src/services/signalRService.js
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

let connection = null;

export function createNotificationConnection({ hubUrl, getJwtToken, onReceive }) {
  // if already created, return existing
  if (connection) return connection;

  connection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: async () => {
        // authService.getToken() or other method to return JWT
        const token = await getJwtToken();
        return token || "";
      }
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  // wire server -> client event
  connection.on("ReceiveNotification", (payload) => {
    // payload expected: { notificationId, title, message, createdAt }
    if (typeof onReceive === "function") onReceive(payload);
  });

  connection.onreconnected((connectionId) => {
    console.log("SignalR reconnected, id:", connectionId);
  });

  connection.onreconnecting((err) => {
    console.log("SignalR reconnecting:", err?.message);
  });

  connection.onclose((err) => {
    console.log("SignalR closed:", err?.message);
  });

  return connection;
}

export async function startConnection() {
  if (!connection) throw new Error("Connection not created. Call createNotificationConnection first.");
  if (connection.state === "Connected" || connection.state === "Connecting") return;
  try {
    await connection.start();
    console.log("SignalR connected:", connection.connectionId);
  } catch (err) {
    console.error("SignalR start failed:", err);
    // Let automatic reconnect try
  }
}

export async function stopConnection() {
  if (!connection) return;
  try {
    await connection.stop();
    connection = null;
  } catch (err) {
    console.error("SignalR stop failed:", err);
  }
}
