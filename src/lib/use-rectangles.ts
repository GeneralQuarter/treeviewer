import { useCallback } from 'react';
import { Rectangle } from '../models/rectangle';
import { getRectanglesWithCoords } from './api/get-rectangles-with-coords';
import { useAPICall, UseAPICall } from './use-api-call';

export function useRectangles(): UseAPICall<Rectangle[]> {
  const getRectangles = useCallback(() => {
    return getRectanglesWithCoords().then(res => res.items);
  }, []);

  return useAPICall('rectangles', [], getRectangles);
}