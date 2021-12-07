import { useEffect, useMemo, useState } from 'react';

type UseGeolocation = [
  activated: boolean, 
  setActivated: (activated: boolean) => void, 
  coords: GeolocationCoordinates | null, 
  error: string
];

export function useGeolocation(): UseGeolocation {
  const [activated, setActivated] = useState<boolean>(false);
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState<string>('');

  const options: PositionOptions = useMemo(() => ({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000
  }), []);

  useEffect(() => {
    setError('');

    if (!activated) {
      return;
    }

    const id = navigator.geolocation.watchPosition(
      pos => setCoords(pos.coords), 
      err => setError(err.message), 
      options
    );

    return () => {
      navigator.geolocation.clearWatch(id)
    }
  }, [options, activated]);

  return [activated, setActivated, coords, error];
}