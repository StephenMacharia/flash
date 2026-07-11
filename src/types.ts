export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  department: string;
}

export type TicketStatus = "Open" | "In Progress" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High";
export type ImpactLevel = "Just Me" | "My Team" | "System-Wide";

export interface Attachment {
  name: string;
  size: number;
  type: string;
  data?: string; // Base64 or file data
}

export interface Ticket {
  id: string;
  userEmail: string;
  dateTime: string; // ISO string
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: TicketPriority;
  impactLevel: ImpactLevel;
  attachments?: Attachment[];
  status: TicketStatus;
}
