import { useEffect, useState, useCallback } from "react";
import { apiGet } from "@/lib/api";

interface UseApiDataOptions<T> {
  initialData?: T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApiData<T = any>(
  url: string | null,
  params?: Record<string, any>,
  options?: UseApiDataOptions<T>
) {
  const [data, setData] = useState<T | undefined>(options?.initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiGet<T>(url, params);
      setData(result);
      options?.onSuccess?.(result);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch data";
      setError(errorMessage);
      options?.onError?.(err);
      console.error(`Error fetching ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    if (options?.enabled === false) return;
    fetchData();
  }, [fetchData]);

  const reload = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, reload };
}
