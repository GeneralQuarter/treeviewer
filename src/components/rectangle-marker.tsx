import { Renderer } from 'leaflet';
import { FC } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { rectangleDimensions } from '../lib/rectangle-dimensions-text';
import { Rectangle } from '../models/rectangle';

interface RectangleMarkerProps {
  rectangle: Rectangle,
  renderer: Renderer,
}

const RectangleMarker: FC<RectangleMarkerProps> = ({ rectangle, renderer }) => {
  return <Polygon
    positions={rectangle.coords ?? []}
    weight={1}
    pathOptions={{ color: 'purple' }}
    renderer={renderer}
  >
    <Tooltip direction="center" className="rectangle-label">
      <span className="label"><b>{rectangle.code}</b><br/>{rectangle.label}</span>
      <div className="dimensions">{rectangleDimensions(rectangle)}</div>
    </Tooltip>
  </Polygon>;
}

export default RectangleMarker;