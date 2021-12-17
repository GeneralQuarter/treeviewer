import { useCallback, useMemo, useRef, useState } from 'react';
import { Circle, Marker, Tooltip, useMapEvent } from 'react-leaflet';
import { Circle as LeafletCircle, Renderer } from 'leaflet';
import HeightTriangle from './height-triangle';
import { Plant } from '../../models/plant';
import PinIcon from '../../lib/leaflet/pin-icon';
import { SelectedTag } from '../../models/selected-tag';
import { colorFromHueIndex } from '../../lib/color-from-hue-index';

export interface PlantMarkerProps {
  plant: Plant;
  onClick?: (event: MouseEvent) => void;
  showLabel: boolean;
  selected: boolean;
  renderer: Renderer;
  selectedTags: SelectedTag[];
}

export default function PlantMarker({ plant, onClick, showLabel, selected, renderer, selectedTags }: PlantMarkerProps) {
  const circleRef = useRef<LeafletCircle | null>(null);
  const [labelFits, setLabelFits] = useState(false);
  const eventHandlers = useMemo(() => ({
    click(e: {target: LeafletCircle, originalEvent: MouseEvent}) {
      onClick?.(e.originalEvent);
    }
  }), [onClick]);

  const pinIcon = useMemo(() => {
    return new PinIcon();
  }, []);

  const fillColor = useMemo(() => {
    const firstSelectedTag = selectedTags.find(t => plant.tags.includes(t.id));

    if (!firstSelectedTag) {
      return 'gray';
    }

    return colorFromHueIndex(firstSelectedTag.hueIndex, 1);
  }, [plant.tags, selectedTags]);

  const isPinned = useMemo(() => {
    return plant.tags.includes('jalonne');
  }, [plant.tags]);

  const updateLabelFits = useCallback(() => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    const { width } = (circle as any)._path.getBoundingClientRect();

    if (width >= 72) {
      if (!labelFits) {
        setLabelFits(true);
      }
    } else {
      if (labelFits) {
        setLabelFits(false);
      }
    }
  }, [circleRef, labelFits]);

  useMapEvent('moveend', updateLabelFits);
  
  return (
    <Circle center={plant.position} 
      radius={plant.width / 2}
      ref={circleRef}
      eventHandlers={eventHandlers}
      pathOptions={{ color: selected ? 'blue' : 'gray', fillColor: fillColor }} 
      weight={1} 
      renderer={renderer} 
    >
      {showLabel && labelFits && 
        <Tooltip direction="center" interactive={false} permanent={true} className="plant-label">
          <div className="code">{plant.code}</div>
          {!isPinned && <div className="height">{plant.height}</div>}
          {!isPinned && <div className="plant-center"></div>}
          {!isPinned && <HeightTriangle height="40" width="40" className="triangle" />}
        </Tooltip>
      }
      {isPinned && <Marker icon={pinIcon} position={plant.position} interactive={false} />}
    </Circle>
  )
}