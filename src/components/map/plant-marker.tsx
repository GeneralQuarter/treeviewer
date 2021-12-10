import { useCallback, useMemo, useRef, useState } from 'react';
import { Circle, Tooltip, useMapEvent } from 'react-leaflet';
import { Circle as LeafletCircle, Renderer } from 'leaflet';
import HeightTriangle from './height-triangle';
import { Plant } from '../../models/plant';

export interface PlantMarkerProps {
  plant: Plant;
  onClick?: (event: MouseEvent) => void;
  selected?: boolean;
  renderer: Renderer
}

export default function PlantMarker({ plant, onClick, selected, renderer }: PlantMarkerProps) {
  const circleRef = useRef<LeafletCircle | null>(null);
  const [showLabel, setShowlabel] = useState(false);
  const eventHandlers = useMemo(() => ({
    click(e: {target: LeafletCircle, originalEvent: MouseEvent}) {
      onClick?.(e.originalEvent);
    }
  }), [onClick]);

  const isAzoteFixator = useMemo(() => {
    return plant.tags.includes('fixateurDazote');
  }, [plant.tags]);

  const updateShowLabel = useCallback(() => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    const { width } = (circle as any)._path.getBoundingClientRect();

    if (width >= 72) {
      if (!showLabel) {
        setShowlabel(true);
      }
    } else {
      if (showLabel) {
        setShowlabel(false)
      }
    }
  }, [circleRef, showLabel]);

  useMapEvent('moveend', updateShowLabel);
  
  return (
    <Circle center={plant.position} 
      radius={plant.width / 2}
      ref={circleRef}
      eventHandlers={eventHandlers}
      pathOptions={{ color: selected ? 'blue' : 'gray', fillColor: isAzoteFixator ? 'green' : 'gray' }} 
      weight={1} 
      renderer={renderer} 
    >
      {selected && showLabel && 
        <Tooltip direction="center" interactive={false} permanent={true} className="plant-label">
          <div className="code">{plant.code}</div>
          <div className="height">{plant.height}</div>
          <div className="plant-center"></div>
          <HeightTriangle height="40" width="40" className="triangle" />
        </Tooltip>
      }
    </Circle>
  )
}