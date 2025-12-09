// src/services/authService.js
import api from "../utils/api";

const authService = {
  register: async (payload) => {
    const resp = await api.post("/api/auth/register", payload);
    return resp.data;
  },

  login: async (payload) => {
    const resp = await api.post("/api/auth/login", payload);
    return resp.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth:logout"));
  },

  // Token getter used by SignalR and other parts of the app
  getToken: () => {
    return localStorage.getItem("token");
  }
};

export default authService;
