import type { User } from "../types";

// Seed accounts. Any of these can be used to log in immediately.
// New signups get appended to this list at runtime (persisted in localStorage).
export const DUMMY_USERS: User[] = [
  {
    id: "u-1001",
    fullName: "Rehema Muchai",
    email: "rehema.muchai@flash.go.ke",
    password: "password123",
    department: "ICT Department",
  },
  {
    id: "u-1002",
    fullName: "John Otieno",
    email: "john.otieno@treasury.go.ke",
    password: "password123",
    department: "Accounting Services",
  },
  {
    id: "u-1003",
    fullName: "Grace Mwangi",
    email: "grace.mwangi@treasury.go.ke",
    password: "password123",
    department: "Procurement",
  },
];

export const DEPARTMENTS = [
  "ICT Department",
  "Accounting Services",
  "Public Debt Management",
  "Economic Affairs",
  "Human Resources",
  "Procurement",
];
