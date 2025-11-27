// src/utils/api.js
import axios from "axios";

// prefer the env value; fall back to the backend URL your server is actually listening on
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7257";

console.log("API base URL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
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
