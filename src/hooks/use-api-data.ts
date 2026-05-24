import { useEffect, useState, useCallback, useRef } from "react";
import { apiGet } from "@/lib/api";

export function useApiData<T>(path: string | null, params?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Serialisasi params sekali agar referensi stabil antar render
  const paramsKey = params !== undefined ? JSON.stringify(params) : "";
  const paramsRef = useRef(params);

  // Update paramsRef hanya saat konten berubah, bukan referensi
  const currentKey = params !== undefined ? JSON.stringify(params) : "";
  if (currentKey !== (paramsRef.current !== undefined ? JSON.stringify(paramsRef.current) : "")) {
    paramsRef.current = params;
  }

  const reload = useCallback(async () => {
    if (!path) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const d = await apiGet<T>(path, paramsRef.current);
      setData(d);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, paramsKey]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
