import { useEffect, useState, useCallback } from 'react';
import { Plant } from '../models/plant';
import { getPlantsWithPosition } from './api/get-plants-with-position';

const cacheKey = 'treeview-plants-v1';

type UsePlants = [
  plants: Plant[],
  loading: boolean,
  error: string | null,
];

export function usePlants(): UsePlants {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    const result = await getPlantsWithPosition();
    setPlants(result.items);
    localStorage.setItem(cacheKey, JSON.stringify(result.items));
  }

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchPlants();
    } catch (e) {
      setError('Could not load plants');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const json = localStorage.getItem(cacheKey);

    if (!json) {
      (async () => {
        await refresh();
      })();
      return;
    }

    try {
      const cachedPlants = JSON.parse(json);
      setPlants(cachedPlants);
    } catch (e) {}

    // Only try to update plants if online and not in development
    if (navigator.onLine && process.env.NODE_ENV !== 'development') {
      (async () => {
        try {
          await fetchPlants();
        } catch (e) {}
      })()
    }
  }, [refresh]);

  return [plants, loading, error];
}