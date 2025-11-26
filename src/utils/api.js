// src/utils/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:7257";

const api = axios.create({
  baseURL: API_BASE + "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
