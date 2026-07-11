import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { DUMMY_USERS } from "../data/dummyUsers";

const USERS_KEY = "hd_users";
const SESSION_KEY = "hd_current_user_email";

interface AuthContextValue {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: Omit<User, "id">) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as User[];
    } catch {
      // fall through to seed
    }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(DUMMY_USERS));
  return DUMMY_USERS;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Restore session on load
  useEffect(() => {
    const savedEmail = localStorage.getItem(SESSION_KEY);
    if (savedEmail) {
      const found = users.find(
        (u) => u.email.toLowerCase() === savedEmail.toLowerCase()
      );
      if (found) setCurrentUser(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistUsers(next: User[]) {
    setUsers(next);
    localStorage.setItem(USERS_KEY, JSON.stringify(next));
  }

  async function login(email: string, password: string): Promise<User> {
    // simulate network latency, like a real API call
    await new Promise((r) => setTimeout(r, 500));

    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!found || found.password !== password) {
      throw new Error("Incorrect email or password.");
    }
    setCurrentUser(found);
    localStorage.setItem(SESSION_KEY, found.email);
    return found;
  }

  async function signup(data: Omit<User, "id">): Promise<User> {
    await new Promise((r) => setTimeout(r, 500));

    const exists = users.some(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    const newUser: User = { ...data, id: `u-${Date.now()}` };
    const next = [...users, newUser];
    persistUsers(next);
    setCurrentUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.email);
    return newUser;
  }

  function logout() {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
