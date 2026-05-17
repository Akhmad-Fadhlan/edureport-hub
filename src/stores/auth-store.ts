import { create } from "zustand";
import { tokenStorage, userStorage, api } from "@/lib/api";

export type Role = "superadmin" | "admin" | "guru";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  init: () => void;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  initialized: false,
  init: () => {
    const t = tokenStorage.get();
    const u = userStorage.get<AuthUser>();
    set({ token: t, user: u, initialized: true });
  },
  login: async (email, password, _remember) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data.data;
    tokenStorage.set(token);
    userStorage.set(user);
    set({ token, user });
  },
  logout: () => {
    tokenStorage.clear();
    set({ token: null, user: null });
    if (typeof window !== "undefined") location.href = "/login";
  },
  isAdmin: () => {
    const r = get().user?.role;
    return r === "admin" || r === "superadmin";
  },
}));
