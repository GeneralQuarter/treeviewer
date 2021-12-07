import { PathOptions } from 'leaflet';
import { latLngAtlToLatLng } from '../lib/leaflet/latLngAltToLatLng';
import { HardcodedMapObject } from '../models/leaflet/hardcoded-map-object';
import { rawCoordinates } from './polygons';

const landmarkPathOptions: PathOptions = { fillColor: 'yellow', fillOpacity: 1, color: 'orange' };

const LANDMARKS: HardcodedMapObject[] = rawCoordinates.terrain.map((coords, index) => ({
  label: `landmark-${index}`,
  pathOptions: landmarkPathOptions,
  positions: [latLngAtlToLatLng(coords)],
}));

export default LANDMARKS;