// src/services/reportService.js
import api from "../utils/api";

const reportService = {
  getSummary: async () => {
    // Summary report: total, open, inProgress, resolved, closed etc.
    const resp = await api.get("/api/reports/summary");
    return resp.data;
  },

  getPerAgent: async () => {
    // If backend provides agent-level reports
    const resp = await api.get("/api/reports/agents");
    return resp.data;
  },

  // Fallback: if backend doesn't provide agent stats, you can compute client-side by
  // fetching all tickets and grouping by assignedToName/Id. But prefer backend endpoint.
};

export default reportService;
