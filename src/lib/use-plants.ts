import { useCallback } from 'react';
import { Plant } from '../models/plant';
import { getPlantsWithPosition } from './api/get-plants-with-position';
import { useAPICall, UseAPICall } from './use-api-call';

export function usePlants(): UseAPICall<Plant[]> {
  const getPlants = useCallback(async () => {
    const res = await getPlantsWithPosition();
    return res.items;
  }, []);

  return useAPICall<Plant[]>('plants', [], getPlants);
}