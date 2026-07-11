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
  updateProfile: (updates: { fullName: string; email: string }) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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

  async function updateProfile(updates: { fullName: string; email: string }): Promise<User> {
    await new Promise((r) => setTimeout(r, 400));

    if (!currentUser) {
      throw new Error("You must be logged in to update your profile.");
    }

    const nextEmail = updates.email.trim();
    const emailTaken = users.some(
      (u) =>
        u.id !== currentUser.id &&
        u.email.toLowerCase() === nextEmail.toLowerCase()
    );
    if (emailTaken) {
      throw new Error("An account with this email already exists.");
    }

    const updatedUser: User = {
      ...currentUser,
      fullName: updates.fullName.trim(),
      email: nextEmail,
    };

    const nextUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    persistUsers(nextUsers);
    setCurrentUser(updatedUser);
    localStorage.setItem(SESSION_KEY, updatedUser.email);
    return updatedUser;
  }

  async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 400));

    if (!currentUser) {
      throw new Error("You must be logged in to change your password.");
    }
    if (currentUser.password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters.");
    }

    const updatedUser: User = { ...currentUser, password: newPassword };
    const nextUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));
    persistUsers(nextUsers);
    setCurrentUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, login, signup, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
