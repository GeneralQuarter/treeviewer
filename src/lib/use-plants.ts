import { useCallback, useEffect, useState } from 'react';
import { Plant } from '../models/plant';
import { getPlantsWithPosition } from './api/get-plants-with-position';
import { useAPICall, UseAPICall } from './use-api-call';

export function usePlants(markedPlantIds: string[]): UseAPICall<Plant[]> {
  const getPlants = useCallback(async () => {
    const res = await getPlantsWithPosition();
    return res.items.sort((a, b) => b.width - a.width);
  }, []);

  const [data, loading, error] = useAPICall<Plant[]>('plants', [], getPlants);
  const [plants, setPlants] = useState<Plant[]>(data);

  useEffect(() => {
    if (!data) {
      setPlants([]);
      return;
    }

    const newPlants = [...data].map(p => {
      if (!markedPlantIds.includes(p.id)) {
        return p;
      }

      return {
        ...p,
        tags: [
          ...p.tags,
          '__marked__'
        ]
      }
    });

    setPlants(newPlants);
  }, [markedPlantIds, data]);

  return [plants, loading, error];
}