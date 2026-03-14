import { create } from "zustand";
import type { AuthSession } from "@/types";

interface AuthStore {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  loadSession: () => void;
}

const ADMIN_EMAIL = "bpillai100@gmail.com";
const DEFAULT_PASSWORD = "Natty@2026!!";
const SESSION_KEY = "infraSession";
const PWD_KEY = "infraAdminPwd";

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isAuthenticated: false,

  login: (email: string, password: string) => {
    const storedPwd =
      typeof window !== "undefined"
        ? localStorage.getItem(PWD_KEY) || DEFAULT_PASSWORD
        : DEFAULT_PASSWORD;

    if (email === ADMIN_EMAIL && password === storedPwd) {
      const session: AuthSession = {
        email: ADMIN_EMAIL,
        name: "B Pillai",
        initials: "BP",
        role: "Admin",
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
      set({ session, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_KEY);
    }
    set({ session: null, isAuthenticated: false });
  },

  loadSession: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw) as AuthSession;
        set({ session, isAuthenticated: true });
      } catch {
        set({ session: null, isAuthenticated: false });
      }
    }
  },
}));
