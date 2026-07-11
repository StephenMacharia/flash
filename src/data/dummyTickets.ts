import type { Ticket } from "../types";

// Seed tickets, keyed by userEmail. New tickets raised via the
// dashboard get appended to this at runtime (persisted in localStorage).
export const DUMMY_TICKETS: Ticket[] = [
  {
    id: "TCK-2041",
    userEmail: "rehema.muchai@flash.go.ke",
    dateTime: "2026-07-08T09:15:00",
    issue: "Cannot connect to office VPN",
    category: "Network",
    priority: "High",
    status: "Resolved",
  },
  {
    id: "TCK-2058",
    userEmail: "rehema.muchai@flash.go.ke",
    dateTime: "2026-07-10T11:40:00",
    issue: "Outlook not syncing new emails",
    category: "Software",
    priority: "Medium",
    status: "In Progress",
  },
  {
    id: "TCK-2063",
    userEmail: "rehema.muchai@flash.go.ke",
    dateTime: "2026-07-11T08:05:00",
    issue: "Request for a second monitor",
    category: "Hardware",
    priority: "Low",
    status: "Open",
  },
  {
    id: "TCK-1987",
    userEmail: "john.otieno@treasury.go.ke",
    dateTime: "2026-07-05T14:22:00",
    issue: "Payroll system login error",
    category: "Access",
    priority: "High",
    status: "Resolved",
  },
  {
    id: "TCK-2011",
    userEmail: "john.otieno@treasury.go.ke",
    dateTime: "2026-07-09T10:00:00",
    issue: "Printer on 3rd floor jamming",
    category: "Hardware",
    priority: "Low",
    status: "Open",
  },
  {
    id: "TCK-1975",
    userEmail: "grace.mwangi@treasury.go.ke",
    dateTime: "2026-07-04T09:30:00",
    issue: "Need access to procurement portal",
    category: "Access",
    priority: "Medium",
    status: "Resolved",
  },
];
