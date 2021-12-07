import { Renderer } from 'leaflet';
import { FC } from 'react';
import { Circle } from 'react-leaflet';
import { HardcodedMapObject } from '../../models/leaflet/hardcoded-map-object';

interface LandmarkMarkerProps {
  landmark: HardcodedMapObject;
  renderer: Renderer;
  onClick?: () => void;
}

const LandmarkMarker: FC<LandmarkMarkerProps> = ({ landmark, renderer, onClick }) => {
  return <Circle center={landmark.positions[0]} radius={2} pathOptions={landmark.pathOptions} renderer={renderer} eventHandlers={{click: () => onClick?.()}}/>
}

export default LandmarkMarker;