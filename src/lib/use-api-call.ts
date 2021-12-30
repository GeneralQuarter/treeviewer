import { useCallback, useEffect, useMemo, useState } from 'react';

export type UseAPICall<T> = [
  data: T,
  loading: boolean,
  error: string | null,
]

export function useAPICall<T>(name: string, initial: T, getData: () => Promise<T>): UseAPICall<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cacheKey = useMemo(() => {
    return `treeview-${name}-v1`;
  }, [name]);

  const fetchData = useCallback(async () => {
    const result = await getData(); 
    setData(result);
    localStorage.setItem(cacheKey, JSON.stringify(result));
  }, [cacheKey, getData]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchData();
    } catch (e) {
      setError(`Could not load ${name}`);
    }

    setLoading(false);
  }, [fetchData, name]);

  useEffect(() => {
    const json = localStorage.getItem(cacheKey);

    if (!json) {
      (async () => {
        await refresh();
      })();
      return;
    }

    try {
      const cachedTags = JSON.parse(json);
      setData(cachedTags);
    } catch (e) {}

    // Only try to update data if online and not in development
    if (navigator.onLine) {
      (async () => {
        try {
          await fetchData();
        } catch (e) {}
      })()
    }
  }, [refresh, fetchData, cacheKey]);

  return [data, loading, error];
}