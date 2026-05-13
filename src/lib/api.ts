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

// ============================================================
// STUDENT PHOTO FUNCTIONS - CORS FIX
// ============================================================

/**
 * Mendapatkan foto siswa dalam bentuk base64
 * @param photo - Nama file foto atau URL
 * @returns Base64 string atau null
 */
export async function getStudentPhotoBase64(photo: string | null | undefined): Promise<string | null> {
  if (!photo) return null;
  
  // Jika sudah dalam format base64, return langsung
  if (photo.startsWith('data:')) return photo;
  
  // Jika sudah URL eksternal, return langsung
  if (photo.startsWith('http')) return photo;
  
  try {
    const response = await apiPost<{ data: string }>('/get-student-photo', { filename: photo });
    return response.data;
  } catch (error) {
    console.error('Failed to load photo:', photo, error);
    return null;
  }
}

/**
 * Mendapatkan multiple foto siswa sekaligus (batch)
 * @param filenames - Array nama file foto
 * @returns Object dengan key filename dan value base64 string
 */
export async function getMultipleStudentPhotos(filenames: string[]): Promise<Record<string, string | null>> {
  if (!filenames.length) return {};
  
  try {
    const response = await apiPost<Record<string, string>>('/get-student-photos', { filenames });
    return response;
  } catch (error) {
    console.error('Failed to load photos:', error);
    return {};
  }
}

/**
 * Cache untuk foto siswa (menyimpan base64 agar tidak perlu request ulang)
 */
export class StudentPhotoCache {
  private static cache = new Map<string, string>();
  private static pendingRequests = new Map<string, Promise<string | null>>();
  
  /**
   * Mendapatkan foto dari cache atau melakukan request jika belum ada
   * @param photo - Nama file foto
   * @returns Base64 string atau null
   */
  static async get(photo: string | null | undefined): Promise<string | null> {
    if (!photo) return null;
    
    // Return dari cache jika ada
    if (this.cache.has(photo)) {
      return this.cache.get(photo)!;
    }
    
    // Cegah duplicate request untuk foto yang sama
    if (this.pendingRequests.has(photo)) {
      return this.pendingRequests.get(photo)!;
    }
    
    // Buat request baru
    const promise = getStudentPhotoBase64(photo).then(result => {
      if (result) {
        this.cache.set(photo, result);
      }
      this.pendingRequests.delete(photo);
      return result;
    });
    
    this.pendingRequests.set(photo, promise);
    return promise;
  }
  
  /**
   * Hapus cache untuk satu foto
   * @param photo - Nama file foto
   */
  static remove(photo: string): void {
    this.cache.delete(photo);
  }
  
  /**
   * Clear semua cache
   */
  static clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
  
  /**
   * Preload multiple photos sekaligus
   * @param photos - Array nama file foto
   */
  static async preload(photos: (string | null | undefined)[]): Promise<void> {
    const validPhotos = photos.filter((p): p is string => !!p);
    if (!validPhotos.length) return;
    
    const results = await getMultipleStudentPhotos(validPhotos);
    for (const [filename, base64] of Object.entries(results)) {
      if (base64) {
        this.cache.set(filename, base64);
      }
    }
  }
}

/**
 * Hook untuk React component (optional, jika menggunakan React)
 * @example
 * const { imageSrc, loading, error } = useStudentPhoto(student.photo);
 */
export function createStudentPhotoHook(React: any) {
  const { useState, useEffect } = React;
  
  return function useStudentPhoto(photo: string | null | undefined) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
      if (!photo) {
        setLoading(false);
        return;
      }
      
      let isMounted = true;
      
      StudentPhotoCache.get(photo)
        .then(result => {
          if (isMounted) {
            setImageSrc(result);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            setError(err);
            setLoading(false);
          }
        });
      
      return () => {
        isMounted = false;
      };
    }, [photo]);
    
    return { imageSrc, loading, error };
  };
}

// Komentar: Hapus atau komentari fungsi studentPhotoUrl yang lama
// export function studentPhotoUrl(photo?: string | null): string | null {
//   if (!photo) return null;
//   if (photo.startsWith("http")) return photo;
//   return `${API_BASE_URL}/photo/${photo}`;
// }
