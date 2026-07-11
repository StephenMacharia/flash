import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Ticket, TicketPriority, ImpactLevel, Attachment } from "../types";
import { DUMMY_TICKETS } from "../data/dummyTickets";

const TICKETS_KEY = "hd_tickets";

interface TicketContextValue {
  tickets: Ticket[];
  getTicketsForUser: (email: string) => Ticket[];
  addTicket: (input: {
    userEmail: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    priority: TicketPriority;
    impactLevel: ImpactLevel;
    attachments?: Attachment[];
  }) => Ticket;
}

const TicketContext = createContext<TicketContextValue | undefined>(undefined);

function loadTickets(): Ticket[] {
  const raw = localStorage.getItem(TICKETS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as Ticket[];
    } catch {
      // fall through to seed
    }
  }
  localStorage.setItem(TICKETS_KEY, JSON.stringify(DUMMY_TICKETS));
  return DUMMY_TICKETS;
}

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(loadTickets);

  function persist(next: Ticket[]) {
    setTickets(next);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(next));
  }

  function getTicketsForUser(email: string): Ticket[] {
    return tickets
      .filter((t) => t.userEmail.toLowerCase() === email.toLowerCase())
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      );
  }

  function addTicket(input: {
    userEmail: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    priority: TicketPriority;
    impactLevel: ImpactLevel;
    attachments?: Attachment[];
  }): Ticket {
    const newTicket: Ticket = {
      id: `IT-${Math.floor(1000 + Math.random() * 9000)}`,
      userEmail: input.userEmail,
      dateTime: new Date().toISOString(),
      title: input.title,
      description: input.description,
      category: input.category,
      subcategory: input.subcategory,
      priority: input.priority,
      impactLevel: input.impactLevel,
      attachments: input.attachments || [],
      status: "Open",
    };
    const next = [newTicket, ...tickets];
    persist(next);
    return newTicket;
  }

  return (
    <TicketContext.Provider value={{ tickets, getTicketsForUser, addTicket }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets(): TicketContextValue {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used within a TicketProvider");
  return ctx;
}
