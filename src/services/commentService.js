// src/services/commentService.js
import api from "../utils/api";

const getByTicket = async (ticketId) => {
  const resp = await api.get(`/api/comments/${ticketId}`);
  return resp.data;
};

const create = async (payload) => {
  const resp = await api.post(`/api/comments`, payload);
  return resp.data;
};

export default { getByTicket, create };
