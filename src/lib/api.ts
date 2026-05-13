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

// Fungsi untuk mengambil photo dari endpoint custom dengan cache
export async function getStudentPhotoBase64(filename: string): Promise<string | null> {
  // Cek cache dulu
  if (photoCache.has(filename)) {
    return photoCache.get(filename) || null;
  }

  try {
    const response = await apiPost<{ data: string }>('/get-student-photo', { filename });
    const photoData = response.data;
    
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
export async function getStudentPhotosBase64(filenames: string[]): Promise<Record<string, string>> {
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
    const response = await apiPost<Record<string, string>>('/get-student-photos', { filenames: uncachedFilenames });
    
    // Simpan ke cache
    Object.entries(response.data).forEach(([key, value]) => {
      photoCache.set(key, value);
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

// Fungsi untuk mendapatkan URL photo - CEK APAKAH FILE EXISTS
export async function studentPhotoUrlWithCheck(photo?: string | null): Promise<string | null> {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  
  const url = `${UPLOADS_BASE}/students/${photo}`;
  
  try {
    // Cek apakah file exists dengan HEAD request
    const response = await fetch(url, { method: 'HEAD' });
    if (response.ok) {
      return url;
    } else {
      console.warn(`Photo not found: ${url}`);
      return null;
    }
  } catch (error) {
    console.error(`Error checking photo: ${url}`, error);
    return null;
  }
}

// Fungsi untuk mendapatkan photo (prioritas base64 dari endpoint)
export async function getStudentPhoto(photo?: string | null): Promise<string | null> {
  if (!photo) return null;
  
  // Jika sudah URL lengkap, return langsung
  if (photo.startsWith("http")) return photo;
  
  // Coba ambil sebagai base64 dari endpoint khusus
  const base64Photo = await getStudentPhotoBase64(photo);
  if (base64Photo) return base64Photo;
  
  // Jika base64 gagal, coba dengan URL
  const url = `${UPLOADS_BASE}/students/${photo}`;
  console.warn(`Using fallback URL for photo: ${url}`);
  return url;
}

// Fungsi kompatibilitas untuk kode lama (tetap menggunakan URL)
export function studentPhotoUrl(photo?: string | null): string | null {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${UPLOADS_BASE}/students/${photo}`;
}

// Clear photo cache (misalnya setelah logout)
export function clearPhotoCache() {
  photoCache.clear();
}
