// src/pages/admin/Reports.jsx
// Chart-based Admin Reports page using Recharts
// No CSS included — structure + chart logic only.

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import reportService from "../../services/reportService";

const SMALL_COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f7f",
  "#a4de6c",
  "#d0ed57",
  "#8dd1e1",
];

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [agentStats, setAgentStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const s = await reportService.getSummary();
      setSummary(s || null);

      try {
        const a = await reportService.getPerAgent();
        setAgentStats(Array.isArray(a) ? a : []);
      } catch (err) {
        // backend might not provide per-agent endpoint yet — fallback to empty
        setAgentStats([]);
      }
    } catch (err) {
      console.error("Failed to load reports", err);
      alert("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  // Defensive summary extraction
  const total = summary?.total ?? summary?.Total ?? summary?.count ?? 0;
  const newCount = summary?.new ?? summary?.New ?? summary?.open ?? summary?.Open ?? 0;
  const inProgress = summary?.inProgress ?? summary?.InProgress ?? summary?.in_progress ?? 0;
  const resolved = summary?.resolved ?? summary?.Resolved ?? 0;
  const closed = summary?.closed ?? summary?.Closed ?? 0;

  // Build pie data
  const pieData = [
    { name: "New", value: Number(newCount) || 0 },
    { name: "In Progress", value: Number(inProgress) || 0 },
    { name: "Resolved", value: Number(resolved) || 0 },
    { name: "Closed", value: Number(closed) || 0 },
  ];

  // If total doesn't match sum, include "Other"
  const sumPie = pieData.reduce((s, p) => s + (p.value || 0), 0);
  if (total && total > sumPie) {
    pieData.push({ name: "Other", value: Number(total) - sumPie });
  }

  // Prepare bar chart data from agentStats (defensive)
  // Expect agentStats array items like: { name, totalHandled, resolved }
  const barData = (Array.isArray(agentStats) ? agentStats : []).map((a, idx) => {
    const name =
      a.name ??
      a.Name ??
      a.userName ??
      a.UserName ??
      a.agentName ??
      a.AgentName ??
      `Agent ${idx + 1}`;

    const totalHandled = Number(a.totalHandled ?? a.TotalHandled ?? a.count ?? a.Count ?? 0);
    const resolvedHandled = Number(a.resolved ?? a.Resolved ?? a.resolvedCount ?? a.ResolvedCount ?? 0);

    return {
      name,
      total: totalHandled,
      resolved: resolvedHandled,
    };
  });

  return (
    <div>
      <h2>Admin Reports (Charts)</h2>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px", minWidth: 320, height: 360 }}>
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="60%"
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={SMALL_COLORS[idx % SMALL_COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8 }}>
            <small>Total tickets: {total}</small>
          </div>
        </div>

        <div style={{ flex: "1 1 500px", minWidth: 420, height: 360 }}>
          <h3>Per-Agent Ticket Counts</h3>
          {barData.length === 0 ? (
            <div>No per-agent data available.</div>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="total" name="Total" />
                <Bar dataKey="resolved" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <hr style={{ marginTop: 18, marginBottom: 18 }} />

      <div>
        <h3>Raw Summary</h3>
        <div>Total: {total}</div>
        <div>New: {newCount}</div>
        <div>In Progress: {inProgress}</div>
        <div>Resolved: {resolved}</div>
        <div>Closed: {closed}</div>
      </div>
    </div>
  );
};

export default Reports;
// // src/pages/admin/Reports.jsx
// // Admin Reports Page – Summary + Per-Agent
// // No CSS included. Pure functional + defensive DTO reading.

// import React, { useEffect, useState } from "react";
// import reportService from "../../services/reportService";

// const Reports = () => {
//   const [summary, setSummary] = useState(null);
//   const [agentStats, setAgentStats] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadReports();
//   }, []);

//   const loadReports = async () => {
//     try {
//       setLoading(true);

//       // --- Summary ---
//       const s = await reportService.getSummary();
//       setSummary(s);

//       // --- Per-Agent (if backend supports it) ---
//       try {
//         const agentData = await reportService.getPerAgent();
//         if (Array.isArray(agentData)) {
//           setAgentStats(agentData);
//         }
//       } catch {
//         // If not implemented in backend, silently ignore
//         setAgentStats([]);
//       }
//     } catch (err) {
//       console.error("Failed to load reports", err);
//       alert("Failed to load reports.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div>Loading reports...</div>;

//   // Summary fields with defensive checking
//   const total = summary?.total ?? summary?.Total ?? summary?.count ?? 0;
//   const newCount = summary?.new ?? summary?.New ?? 0;
//   const inProgress = summary?.inProgress ?? summary?.InProgress ?? 0;
//   const resolved = summary?.resolved ?? summary?.Resolved ?? 0;
//   const closed = summary?.closed ?? summary?.Closed ?? 0;

//   return (
//     <div>
//       <h2>Admin Reports</h2>

//       {/* ---------------- SUMMARY BLOCK ---------------- */}
//       <div>
//         <h3>Summary</h3>
//         <div>Total Tickets: {total}</div>
//         <div>New: {newCount}</div>
//         <div>In Progress: {inProgress}</div>
//         <div>Resolved: {resolved}</div>
//         <div>Closed: {closed}</div>
//       </div>

//       <hr />

//       {/* ---------------- PER AGENT BLOCK ---------------- */}
//       <div>
//         <h3>Support Team Performance</h3>

//         {agentStats.length === 0 ? (
//           <div>No per-agent report available.</div>
//         ) : (
//           <div>
//             {agentStats.map((a, idx) => {
//               const name =
//                 a.name ??
//                 a.Name ??
//                 a.userName ??
//                 a.UserName ??
//                 a.agentName ??
//                 a.AgentName ??
//                 `Agent ${idx + 1}`;

//               const totalHandled =
//                 a.totalHandled ?? a.TotalHandled ?? a.count ?? a.Count ?? 0;

//               const resolvedHandled =
//                 a.resolved ?? a.Resolved ?? a.resolvedCount ?? a.ResolvedCount ?? null;

//               return (
//                 <div
//                   key={idx}
//                   style={{
//                     border: "1px solid #ddd",
//                     padding: 10,
//                     marginBottom: 10,
//                     borderRadius: 6,
//                   }}
//                 >
//                   <div><strong>{name}</strong></div>
//                   <div>Total Tickets Handled: {totalHandled}</div>
//                   {resolvedHandled !== null && (
//                     <div>Resolved: {resolvedHandled}</div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reports;
