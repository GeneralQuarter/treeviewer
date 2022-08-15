import { LatLngTuple, Map } from 'leaflet';
import { FC, PropsWithChildren, useMemo } from 'react';
import { MapContainer } from 'react-leaflet';
import { addSmoothWheelZoom } from '../../lib/leaflet/add-smooth-wheel-zoom';

interface EditorMapProps {
  setMap: (map: Map) => void
}

const EditorMap: FC<PropsWithChildren<EditorMapProps>> = ({ children, setMap }) => {
  const initialCenter = useMemo(() => {
    return [46.37926, 0.88279] as LatLngTuple;
  }, []);

  return <MapContainer
    center={initialCenter}
    zoom={17}
    maxZoom={24}
    style={{ width: '100vw', height: '100vh' }}
    scrollWheelZoom={false}
    doubleClickZoom={false}
    zoomControl={false}
    ref={(map: Map) => {
      if (!map) {
        return;
      }
      addSmoothWheelZoom(map);
      setMap(map);
    }}
  >
    {children}
  </MapContainer>;
}

export default EditorMap;