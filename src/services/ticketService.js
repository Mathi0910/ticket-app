// src/services/ticketService.js
import api from "../utils/api";

const getAll = async () => {
  const resp = await api.get("/api/tickets");
  return resp.data;
};

const getById = async (id) => {
  const resp = await api.get(`/api/tickets/${id}`);
  return resp.data;
};

const create = async (payload) => {
  const resp = await api.post("/api/tickets", payload);
  return resp.data;
};

const update = async (id, payload) => {
  const resp = await api.put(`/api/tickets/${id}`, payload);
  return resp.data;
};

const remove = async (id) => {
  const resp = await api.delete(`/api/tickets/${id}`);
  return resp.data;
};

export default { getAll, getById, create, update, remove };

