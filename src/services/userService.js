// src/services/userService.js
import api from "../utils/api";

const userService = {
  getAll: async () => {
    const resp = await api.get("/api/users");
    return resp.data;
  },

  getById: async (id) => {
    const resp = await api.get(`/api/users/${id}`);
    return resp.data;
  },

  updateStatus: async (id, payload) => {
    // e.g. { isActive: false } or similar endpoint
    const resp = await api.put(`/api/users/${id}/status`, payload);
    return resp.data;
  },
};

export default userService;

// // src/services/userService.js
// import api from "../utils/api";

// const getAll = async () => {
//   const resp = await api.get("/api/users");
//   return resp.data;
// };

// const updateStatus = async (id, isActive) => {
//   const resp = await api.put(`/api/users/${id}/status`, { isActive });
//   return resp.data;
// };

// export default { getAll, updateStatus };
