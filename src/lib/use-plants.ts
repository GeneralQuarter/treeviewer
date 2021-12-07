import { useEffect,  useState } from 'react';
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

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPlantsWithPosition();
      setPlants(result.items);
      localStorage.setItem(cacheKey, JSON.stringify(result.items));
    } catch (e) {
      setError('Could not load plants');
    }

    setLoading(false);
  }

  useEffect(() => {
    const json = localStorage.getItem(cacheKey);

    if (!json) {
      (async () => {
        await refetch();
      })()
      return;
    }

    try {
      const cachedPlants = JSON.parse(json);
      setPlants(cachedPlants);
    } catch (e) {}
  }, []);

  return [plants, loading, error];
}