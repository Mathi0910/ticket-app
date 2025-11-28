// src/utils/api.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7257";
console.log("API base URL:", baseURL);

const api = axios.create({
  baseURL,
   withCredentials: false, // <-- false for bearer token flows
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
