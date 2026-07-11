export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  department: string;
}

export type TicketStatus = "Open" | "In Progress" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High";

export interface Ticket {
  id: string;
  userEmail: string;
  dateTime: string; // ISO string
  issue: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
}
