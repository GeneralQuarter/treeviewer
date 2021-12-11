import { Icon } from 'leaflet';

const PinIcon = Icon.extend({
  options: {
    iconUrl: 'pin.svg',
    iconSize: [32, 32],
    iconAnchor: [18, 26],
  }
});

export default PinIcon;