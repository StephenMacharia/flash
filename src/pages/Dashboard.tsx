import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTickets } from "../context/TicketContext";
import RaiseTicketModal from "../components/RaiseTicketModal";
import type { TicketStatus } from "../types";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const statusStyles: Record<TicketStatus, string> = {
  Open: "bg-[#0D98BA]/10 text-[#0B7E9A]",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { getTicketsForUser, addTicket } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);

  if (!currentUser) return null;

  const tickets = getTicketsForUser(currentUser.email);

  const counts = useMemo(() => {
    return {
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      resolved: tickets.filter((t) => t.status === "Resolved").length,
    };
  }, [tickets]);

  function handleRaiseTicket(input: { issue: string; category: string; priority: any }) {
    addTicket({ userEmail: currentUser!.email, ...input });
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F4F7F8] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top nav */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">
              National Treasury
            </div>
            <div className="text-sm font-bold text-[#1F2937]">Employee Dashboard</div>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-[#64748B] hover:text-[#1F2937]"
          >
            Log out
          </button>
        </div>

        {/* Greeting banner */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#0D98BA] to-[#086A82] p-6 text-white sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-medium text-teal-50/90">{greeting()}</div>
            <div className="mt-1 text-2xl font-bold">{currentUser.fullName}</div>
            <div className="mt-1 text-sm text-teal-50/80">
              {currentUser.department} · {currentUser.email}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0B7E9A] transition hover:bg-teal-50"
            >
              Raise a Ticket
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="rounded-lg border border-white/50 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Open" value={counts.open} />
          <StatCard label="In Progress" value={counts.inProgress} />
          <StatCard label="Resolved" value={counts.resolved} />
        </div>

        {/* Ticket history + quick actions */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1F2937]">Ticket History</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-xs uppercase tracking-wide text-[#64748B]">
                    <th className="pb-2 pr-4">Date/Time</th>
                    <th className="pb-2 pr-4">Ticket ID</th>
                    <th className="pb-2 pr-4">Issue</th>
                    <th className="pb-2 pr-4">Category/Priority</th>
                    <th className="pb-2 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-sm text-[#64748B]">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="py-3 pr-4 text-[#64748B]">
                        {new Date(t.dateTime).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 pr-4 font-medium text-[#1F2937]">{t.id}</td>
                      <td className="py-3 pr-4 text-[#1F2937]">{t.issue}</td>
                      <td className="py-3 pr-4 text-[#64748B]">
                        {t.category} / {t.priority}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#1F2937]">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <QuickAction label="Raise a Ticket" onClick={() => setModalOpen(true)} />
              <QuickAction label="Request Assistance" />
              <QuickAction label="Ticket History" />
              <QuickAction label="My Profile" onClick={() => navigate("/profile")} />
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <RaiseTicketModal onClose={() => setModalOpen(false)} onSubmit={handleRaiseTicket} />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="text-3xl font-bold text-[#0D98BA]">{value}</div>
      <div className="mt-1 text-sm text-[#64748B]">{label}</div>
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-[#E2E8F0] px-3 py-4 text-center text-sm font-medium text-[#1F2937] transition hover:border-[#0D98BA] hover:bg-[#0D98BA]/5"
    >
      {label}
    </button>
  );
}
