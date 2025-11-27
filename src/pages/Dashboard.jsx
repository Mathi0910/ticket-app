// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import TicketCard from "./components/TicketCard";
import "./Dashboard.css";
import ticketService from "../services/ticketService"; // your service to call /api/tickets
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await ticketService.getAll(); // must return array of tickets
        if (!mounted) return;
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load tickets:", err);
        if (mounted) setTickets([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // derive counts for summary
  const counts = tickets.reduce(
    (acc, t) => {
      const status = (t.status ?? "").toLowerCase();
      if (status.includes("new")) acc.new++;
      else if (status.includes("inprogress") || status.includes("in progress")) acc.inProgress++;
      else if (status.includes("resolved")) acc.resolved++;
      else if (status.includes("closed")) acc.closed++;
      else acc.others++;
      return acc;
    },
    { new: 0, inProgress: 0, resolved: 0, closed: 0, others: 0 }
  );

  return (
    <div className="dash-root">
      <header className="dash-header">
        <div className="dash-brand">
          <h1>Ticket System</h1>
          <div className="dash-sub">Welcome {user?.email ?? "User"}</div>
        </div>
        <div className="dash-actions">
          <button className="btn-primary">Create Ticket</button>
        </div>
      </header>

      <main className="dash-grid">
        <section className="dash-main">
          <div className="dash-title">
            <h2>My Tickets</h2>
            <div className="dash-filter">No filters yet</div>
          </div>

          {loading ? (
            <div className="empty-state">Loading tickets…</div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" aria-hidden>
                <path fill="currentColor" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14h-2v-2h2zm0-4h-2V7h2z"/>
              </svg>
              <p>No tickets yet.</p>
              <small>Create a ticket to get started.</small>
            </div>
          ) : (
            <div className="ticket-list">
              {tickets.map((t) => (
                <TicketCard key={t.ticketId ?? t.ticketId ?? t.id} ticket={t} />
              ))}
            </div>
          )}
        </section>

        <aside className="dash-side">
          <div className="summary-card">
            <h3>Summary</h3>
            <div className="summary-row">
              <div>New</div>
              <div className="badge">{counts.new}</div>
            </div>
            <div className="summary-row">
              <div>In Progress</div>
              <div className="badge">{counts.inProgress}</div>
            </div>
            <div className="summary-row">
              <div>Resolved</div>
              <div className="badge">{counts.resolved}</div>
            </div>
            <div className="summary-row">
              <div>Closed</div>
              <div className="badge">{counts.closed}</div>
            </div>

            <hr />

            <div className="summary-foot">
              <small>Total tickets</small>
              <div className="total">{tickets.length}</div>
            </div>
          </div>

          <div className="help-card">
            <h4>Need help?</h4>
            <p>Contact support or create a new ticket describing the issue.</p>
            <button className="btn-ghost">Contact support</button>
          </div>
        </aside>
      </main>
    </div>
  );
}
