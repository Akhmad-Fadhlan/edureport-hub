import { create } from "zustand";
import { tokenStorage, userStorage, api } from "@/lib/api";

export type Role = "superadmin" | "admin" | "guru";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  cabang_id?: number | null; // ID cabang yang dimiliki guru (null = semua cabang)
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  init: () => void;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
  isGuru: () => boolean;
  /**
   * Mengembalikan cabang_id dari user yang login.
   * - Jika role guru: mengembalikan cabang_id guru tersebut
   * - Jika admin/superadmin: null (tidak dibatasi cabang)
   */
  getCabangId: () => number | null;
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
  isGuru: () => {
    return get().user?.role === "guru";
  },
  getCabangId: () => {
    const u = get().user;
    if (!u) return null;
    if (u.role === "guru") return u.cabang_id ?? null;
    return null;
  },
}));
