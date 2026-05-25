import { create } from "zustand";
import { tokenStorage, userStorage, api } from "@/lib/api";

export type Role = "superadmin" | "admin" | "guru";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  /**
   * Cabang sebagai string enum (misal: "jonggol", "pamijahan", dll.)
   * Dikirim oleh backend di response login.
   */
  cabang?: string | null;
  /** @deprecated Gunakan `cabang` (string). Tetap ada untuk kompatibilitas. */
  cabang_id?: number | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  init: () => void;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  /** true jika role admin atau superadmin */
  isAdmin: () => boolean;
  /** true jika role guru */
  isGuru: () => boolean;
  /** true jika role superadmin */
  isSuperAdmin: () => boolean;
  /**
   * Mengembalikan string cabang guru (misal "jonggol").
   * Null jika bukan guru atau belum login.
   */
  getCabang: () => string | null;
  /** @deprecated Gunakan getCabang() */
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

  isGuru: () => get().user?.role === "guru",

  isSuperAdmin: () => get().user?.role === "superadmin",

  getCabang: () => {
    const u = get().user;
    if (!u || u.role !== "guru") return null;
    return u.cabang ?? null;
  },

  /** @deprecated */
  getCabangId: () => get().user?.cabang_id ?? null,
}));
