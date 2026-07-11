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
  Open: "bg-[#0D98BA]/10 text-[#086A82]",
  "In Progress": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

type IconName = "grid" | "help" | "clock" | "user" | "bell" | "plus" | "check" | "spinner" | "ticket";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 1 1 4.4 1.9c-.95.78-1.9 1.25-1.9 2.6" /><path d="M12 17h.01" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 21c.7-3.4 3-5 7-5s6.3 1.6 7 5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    spinner: <path d="M12 3a9 9 0 1 0 9 9" />,
    ticket: <><path d="M4 7a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4v1h16v-1a2 2 0 0 0 0-4v-2a2 2 0 0 0 0-4V6H4z" /><path d="M12 7v10" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { getTicketsForUser, addTicket } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);
  if (!currentUser) return null;

  const tickets = getTicketsForUser(currentUser.email);
  const counts = useMemo(() => ({
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  }), [tickets]);

  function handleRaiseTicket(input: { issue: string; category: string; priority: any }) {
    addTicket({ userEmail: currentUser.email, ...input });
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#1F2937]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#12313B] px-5 py-7 text-white lg:flex">
        <div className="flex items-center gap-3 border-b border-white/15 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D98BA] font-black">NT</div>
          <div><p className="text-sm font-bold">The National</p><p className="text-sm font-bold">Treasury</p></div>
        </div>
        <p className="mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Employee portal</p>
        <nav className="mt-4 space-y-2">
          <NavItem icon="grid" label="Dashboard" active />
          <NavItem icon="help" label="Request Assistance" onClick={() => setModalOpen(true)} />
          <NavItem icon="clock" label="Ticket History" />
          <NavItem icon="user" label="Profile" />
        </nav>
        <button onClick={logout} className="mt-auto rounded-lg border border-white/20 px-4 py-2.5 text-left text-sm font-semibold text-white/80 transition hover:bg-white/10">Log out</button>
      </aside>

      <main className="lg:ml-64">
        <header className="flex h-20 items-center justify-between border-b border-[#E2E8F0] bg-white px-5 sm:px-8">
          <div><p className="text-sm font-semibold text-[#1F2937]">National Treasury <span className="text-[#64748B]">/</span> Employee Dashboard</p><p className="mt-1 text-xs text-[#64748B]">Help desk portal</p></div>
          <div className="flex items-center gap-4"><button className="text-[#64748B] hover:text-[#0D98BA]" aria-label="Notifications"><Icon name="bell" className="h-5 w-5" /></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0D98BA] text-sm font-bold text-white">{currentUser.fullName.charAt(0)}</div></div>
        </header>

        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          <section className="rounded-2xl bg-gradient-to-r from-[#0D98BA] to-[#086A82] px-6 py-7 text-white shadow-lg shadow-[#086A82]/15 sm:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{greeting()}</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">{currentUser.fullName}</h1><p className="mt-2 text-sm text-white/75">{currentUser.department} <span className="mx-1">•</span> {currentUser.email}</p></div>
              <div className="flex flex-wrap gap-3"><button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-[#086A82] shadow-sm transition hover:bg-[#E8F8FC]"><Icon name="plus" className="h-4 w-4" /> Raise a Ticket</button><button className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"><Icon name="user" className="h-4 w-4" /> My Profile</button></div>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard label="Total Raised" value={tickets.length} icon="ticket" />
            <StatCard label="Open" value={counts.open} icon="clock" />
            <StatCard label="In Progress" value={counts.inProgress} icon="spinner" />
            <StatCard label="Resolved" value={counts.resolved} icon="check" />
          </section>

          <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold">Ticket History</h2><p className="mt-1 text-sm text-[#64748B]">Your recently raised support tickets</p></div><button onClick={() => setModalOpen(true)} className="hidden rounded-lg bg-[#0D98BA] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0B7E9A] sm:block">New ticket</button></div><TicketTable tickets={tickets} /></div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold">Quick Actions</h2><p className="mt-1 text-sm text-[#64748B]">What would you like to do?</p><div className="mt-5 grid grid-cols-2 gap-3"><QuickAction icon="help" label="Request Assistance" onClick={() => setModalOpen(true)} /><QuickAction icon="clock" label="Ticket History" /><QuickAction icon="user" label="My Profile" /><QuickAction icon="plus" label="Raise a Ticket" onClick={() => setModalOpen(true)} /></div></div>
          </section>
        </div>
      </main>
      {modalOpen && <RaiseTicketModal onClose={() => setModalOpen(false)} onSubmit={handleRaiseTicket} />}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: IconName; label: string; active?: boolean; onClick?: () => void }) { return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${active ? "bg-[#0D98BA] text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><Icon name={icon} className="h-5 w-5" />{label}</button>; }
function StatCard({ label, value, icon }: { label: string; value: number; icon: IconName }) { return <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center gap-3"><div className="rounded-lg bg-[#0D98BA]/10 p-2 text-[#0D98BA]"><Icon name={icon} className="h-5 w-5" /></div><div><p className="text-2xl font-bold leading-none">{value}</p><p className="mt-1 text-sm font-medium text-[#64748B]">{label}</p></div></div></div>; }
function QuickAction({ icon, label, onClick }: { icon: IconName; label: string; onClick?: () => void }) { return <button onClick={onClick} className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border border-[#E2E8F0] p-3 text-center text-sm font-semibold transition hover:border-[#0D98BA] hover:bg-[#0D98BA]/5 hover:text-[#086A82]"><span className="rounded-lg bg-[#0D98BA]/10 p-2 text-[#0D98BA]"><Icon name={icon} className="h-5 w-5" /></span>{label}</button>; }
function TicketTable({ tickets }: { tickets: ReturnType<ReturnType<typeof useTickets>["getTicketsForUser"]> }) { return <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-y border-[#E2E8F0] text-xs font-bold uppercase tracking-wide text-[#64748B]"><th className="px-2 py-3">Date / Time</th><th className="px-2 py-3">Ticket ID</th><th className="px-2 py-3">Issue</th><th className="px-2 py-3">Category / Priority</th><th className="px-2 py-3">Status</th></tr></thead><tbody>{tickets.length === 0 ? <tr><td colSpan={5} className="px-2 py-12 text-center text-[#64748B]">No tickets found. Raise a ticket to get started.</td></tr> : tickets.map((t) => <tr key={t.id} className="border-b border-[#E2E8F0]/70 last:border-0"><td className="px-2 py-4 text-[#64748B]">{new Date(t.dateTime).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td><td className="px-2 py-4 font-semibold">{t.id}</td><td className="max-w-[180px] truncate px-2 py-4">{t.issue}</td><td className="px-2 py-4 text-[#64748B]">{t.category} / {t.priority}</td><td className="px-2 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[t.status]}`}>{t.status}</span></td></tr>)}</tbody></table></div>; }
