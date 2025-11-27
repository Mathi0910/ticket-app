// src/services/userService.js
import api from "../utils/api";

const getAll = async () => {
  const resp = await api.get("/api/users");
  return resp.data;
};

const updateStatus = async (id, isActive) => {
  const resp = await api.put(`/api/users/${id}/status`, { isActive });
  return resp.data;
};

export default { getAll, updateStatus };
