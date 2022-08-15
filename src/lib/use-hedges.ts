import { useCallback } from 'react';
import { Hedge } from '../models/hedge';
import { getHedges as getPaginatedHedges } from './api/get-hedges';
import { useAPICall, UseAPICall } from './use-api-call';

export function useHedges(): UseAPICall<Hedge[]> {
  const getHedges = useCallback(() => {
    return getPaginatedHedges().then(res => res.items);
  }, []);

  return useAPICall('hedges', [], getHedges);
}