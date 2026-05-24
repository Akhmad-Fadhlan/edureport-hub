import { useEffect, useState, useCallback } from "react";
import { apiGet } from "@/lib/api";

export function useApiData<T>(path: string | null, params?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const d = await apiGet<T>(path, params);
      setData(d);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, JSON.stringify(params)]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
