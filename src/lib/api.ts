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

// Cache untuk photo yang sudah di-load
const photoCache = new Map<string, string>();

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
    // Clear photo cache juga saat logout
    photoCache.clear();
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

function normalizeApiImage(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "string") return raw.replace("data:image\\/", "data:image/");
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    return normalizeApiImage(obj.data ?? obj.photo ?? obj.url ?? obj.image ?? obj.base64);
  }
  return null;
}

// Fungsi utama untuk mengambil photo dari endpoint API (dengan cache)
export async function getStudentPhoto(filename: string | null | undefined): Promise<string | null> {
  if (!filename) return null;
  
  // Cek cache
  if (photoCache.has(filename)) {
    return photoCache.get(filename) || null;
  }
  
  try {
    // Panggil endpoint API yang benar
    const response = await apiPost<string | { data?: string }>('/get-student-photo', { filename });
    const photoData = normalizeApiImage(response);
    
    // Simpan ke cache
    if (photoData) {
      photoCache.set(filename, photoData);
    }
    
    return photoData;
  } catch (error) {
    console.error('Error fetching student photo:', error);
    return null;
  }
}

// Fungsi untuk mengambil multiple photos sekaligus
export async function getStudentPhotos(filenames: string[]): Promise<Record<string, string>> {
  if (!filenames.length) return {};
  
  // Filter yang belum ada di cache
  const uncachedFilenames = filenames.filter(f => !photoCache.has(f));
  
  if (uncachedFilenames.length === 0) {
    // Semua sudah di cache
    const result: Record<string, string> = {};
    filenames.forEach(f => {
      const cached = photoCache.get(f);
      if (cached) result[f] = cached;
    });
    return result;
  }
  
  try {
    // Panggil endpoint untuk multiple photos
    const response = await apiPost<Record<string, string>>('/get-student-photos', { filenames: uncachedFilenames });
    
    // Simpan ke cache
    Object.entries(response).forEach(([key, value]) => {
      const normalized = normalizeApiImage(value);
      if (normalized) photoCache.set(key, normalized);
    });
    
    // Return semua (termasuk dari cache)
    const result: Record<string, string> = {};
    filenames.forEach(f => {
      const cached = photoCache.get(f);
      if (cached) result[f] = cached;
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching student photos:', error);
    return {};
  }
}

// DEPRECATED: Jangan gunakan fungsi ini lagi karena mengakses langsung ke folder uploads
// yang menyebabkan 404. Gunakan getStudentPhoto() sebagai gantinya.
export function studentPhotoUrl(photo?: string | null): string | null {
  console.warn('studentPhotoUrl is deprecated. Use getStudentPhoto() instead.');
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  // Ini akan tetap 404 karena file tidak bisa diakses langsung
  return `${UPLOADS_BASE}/students/${photo}`;
}

// Clear photo cache
export function clearPhotoCache() {
  photoCache.clear();
}

// Preload multiple photos
export async function preloadStudentPhotos(filenames: string[]) {
  const validFilenames = filenames.filter(f => f && !photoCache.has(f));
  if (validFilenames.length > 0) {
    await getStudentPhotos(validFilenames);
  }
}
