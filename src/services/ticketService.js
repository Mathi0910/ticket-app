// src/services/ticketService.js
import api from "../utils/api";

const ticketService = {
  getAll: async (query = "") => {
    // query string optional, e.g. "?status=Open"
    const resp = await api.get(`/api/tickets${query}`);
    return resp.data;
  },

  getById: async (id) => {
    const resp = await api.get(`/api/tickets/${id}`);
    return resp.data;
  },

  create: async (payload) => {
    const resp = await api.post("/api/tickets", payload);
    return resp.data;
  },

  update: async (id, payload) => {
    // Use PUT to update status/assignedTo etc.
    const resp = await api.put(`/api/tickets/${id}`, payload);
    return resp.data;
  },

  remove: async (id) => {
    const resp = await api.delete(`/api/tickets/${id}`);
    return resp.data;
  },

  getOrdered: async () => {
    // backend endpoint that returns tickets ordered by priority (if implemented)
    const resp = await api.get("/api/tickets/ordered");
    return resp.data;
  },

  getMine: async () => {
    // returns tickets created by the current user (if backend supports it)
    const resp = await api.get("/api/tickets/mine");
    return resp.data;
  },
};

export default ticketService;

// // src/services/ticketService.js
// import api from "../utils/api";

// const getAll = async () => {
//   const resp = await api.get("/api/tickets");
//   return resp.data;
// };

// const getById = async (id) => {
//   const resp = await api.get(`/api/tickets/${id}`);
//   return resp.data;
// };

// const create = async (payload) => {
//   const resp = await api.post("/api/tickets", payload);
//   return resp.data;
// };

// const update = async (id, payload) => {
//   const resp = await api.put(`/api/tickets/${id}`, payload);
//   return resp.data;
// };

// const remove = async (id) => {
//   const resp = await api.delete(`/api/tickets/${id}`);
//   return resp.data;
// };

// export default { getAll, getById, create, update, remove };

