import axios from "axios";
import { toast } from "sonner";

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://rapor.codestechno.com/api";

export const UPLOADS_BASE = "https://rapor.codestechno.com/upload";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

const TOKEN_KEY = "rapor_token";
const USER_KEY = "rapor_user";

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (t: string) => {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, t);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const userStorage = {
  get: <T = any>(): T | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  set: (u: unknown) => {
    if (typeof window !== "undefined")
      localStorage.setItem(USER_KEY, JSON.stringify(u));
  },
};

api.interceptors.request.use((config) => {
  const t = tokenStorage.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      toast.error("Koneksi bermasalah. Periksa jaringan Anda.");
    } else if (error.response.status === 401) {
      tokenStorage.clear();
      if (typeof window !== "undefined" && !location.pathname.startsWith("/login")) {
        toast.error("Sesi berakhir. Silakan login ulang.");
        location.href = "/login";
      }
    } else {
      const msg = error.response?.data?.message || "Terjadi kesalahan";
      if (error.response.status >= 500) toast.error(msg);
    }
    return Promise.reject(error);
  },
);

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function apiGet<T>(path: string, params?: any): Promise<T> {
  const res = await api.get<ApiResponse<T>>(path, { params });
  return res.data.data;
}
export async function apiPost<T>(path: string, body?: any, config?: any): Promise<T> {
  const res = await api.post<ApiResponse<T>>(path, body, config);
  return res.data.data;
}
export async function apiPut<T>(path: string, body?: any): Promise<T> {
  const res = await api.put<ApiResponse<T>>(path, body);
  return res.data.data;
}
export async function apiDelete<T>(path: string): Promise<T> {
  const res = await api.delete<ApiResponse<T>>(path);
  return res.data.data;
}

// Hapus fungsi studentPhotoUrl yang lama, ganti dengan ini:

export async function getStudentPhotoBase64(photo: string | null | undefined): Promise<string | null> {
  if (!photo) return null;
  if (photo.startsWith('data:')) return photo; // Already base64
  if (photo.startsWith('http')) return photo; // External URL
  
  try {
    const response = await apiPost<{ data: string }>('/get-student-photo', { filename: photo });
    return response.data;
  } catch (error) {
    console.error('Failed to load photo:', photo, error);
    return null;
  }
}

// Optional: Batch load multiple photos
export async function getMultipleStudentPhotos(filenames: string[]): Promise<Record<string, string | null>> {
  try {
    const response = await apiPost<Record<string, string>>('/get-student-photos', { filenames });
    return response;
  } catch (error) {
    console.error('Failed to load photos:', error);
    return {};
  }
}

// Mock untuk komponen yang butuh sync (gunakan state management)
export class StudentPhotoCache {
  private static cache = new Map<string, string>();
  
  static async get(photo: string | null | undefined): Promise<string | null> {
    if (!photo) return null;
    if (this.cache.has(photo)) return this.cache.get(photo)!;
    
    const base64 = await getStudentPhotoBase64(photo);
    if (base64) this.cache.set(photo, base64);
    return base64;
  }
  
  static clear(): void {
    this.cache.clear();
  }
}
