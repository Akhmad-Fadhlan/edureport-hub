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

// Fungsi baru untuk mengambil photo dari endpoint custom
export async function getStudentPhotoBase64(filename: string): Promise<string | null> {
  try {
    const response = await apiPost<{ data: string }>('/get-student-photo', { filename });
    return response.data;
  } catch (error) {
    console.error('Error fetching student photo:', error);
    return null;
  }
}

// Fungsi untuk mengambil multiple photos sekaligus
export async function getStudentPhotosBase64(filenames: string[]): Promise<Record<string, string>> {
  try {
    const response = await apiPost<Record<string, string>>('/get-student-photos', { filenames });
    return response.data;
  } catch (error) {
    console.error('Error fetching student photos:', error);
    return {};
  }
}

// Fungsi untuk mendapatkan URL photo (menggunakan UPLOADS_BASE)
export function studentPhotoUrl(photo?: string | null): string | null {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  // Menggunakan UPLOADS_BASE untuk akses langsung ke file
  return `${UPLOADS_BASE}/students/${photo}`;
}

// Fungsi helper untuk menampilkan photo (prioritaskan base64 jika diperlukan)
export async function getStudentPhotoDisplay(photo?: string | null): Promise<string | null> {
  if (!photo) return null;
  
  // Jika sudah URL lengkap, return langsung
  if (photo.startsWith("http")) return photo;
  
  // Coba ambil sebagai base64 dari endpoint khusus
  const base64Photo = await getStudentPhotoBase64(photo);
  if (base64Photo) return base64Photo;
  
  // Fallback ke URL biasa
  return `${UPLOADS_BASE}/students/${photo}`;
}
