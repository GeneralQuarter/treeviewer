import { PathOptions, Renderer } from 'leaflet';
import { FC } from 'react';
import { Circle, Tooltip } from 'react-leaflet';
import { blue } from '@mui/material/colors';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

interface LocationIndicatorProps {
  coords: GeolocationCoordinates;
  renderer: Renderer;
}

const locationIndicatorPathOptions: PathOptions = { fillColor: blue[700], fillOpacity: 0.4, color: blue[700], opacity: 0.5 };

const LocationIndicator: FC<LocationIndicatorProps> = ({ coords, renderer }) => {
  return <Circle 
    center={[coords.latitude, coords.longitude]} 
    radius={coords.accuracy / 2} 
    pathOptions={locationIndicatorPathOptions}
    renderer={renderer}
    interactive={false}
  >
    <Tooltip direction="center" permanent={true} interactive={false} className="location-indicator-center">
      <LocationSearchingIcon />
    </Tooltip>
  </Circle>
}

export default LocationIndicator;