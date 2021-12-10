import { Renderer } from 'leaflet';
import { FC, useMemo } from 'react';
import { Circle } from 'react-leaflet';
import { HardcodedMapObject } from '../../models/leaflet/hardcoded-map-object';

interface LandmarkMarkerProps {
  landmark: HardcodedMapObject;
  renderer: Renderer;
  onClick?: () => void;
}

const LandmarkMarker: FC<LandmarkMarkerProps> = ({ landmark, renderer, onClick }) => {
  const eventHandlers = useMemo(() => ({
    click: () => onClick?.()
  }), [onClick]);

  return <Circle 
    center={landmark.positions[0]} 
    radius={2} 
    pathOptions={landmark.pathOptions} 
    renderer={renderer} 
    eventHandlers={eventHandlers}
  />
}

export default LandmarkMarker;