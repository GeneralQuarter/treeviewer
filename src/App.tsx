import { useMemo, useState } from 'react';
import EditorMap from './components/map/editor-map';
import styled from '@emotion/styled';
import { useMeasurementGraph } from './lib/use-measurement-graph';
import POLYGONS from './data/polygons';
import POLYLINES from './data/polylines';
import { LatLng, SVG } from 'leaflet';
import { Plant } from './models/plant';
import { Polygon, Polyline } from 'react-leaflet';
import PlantMarker from './components/map/plant-marker';
import MeasurementPolyline from './components/map/measurement-polyline';
import { usePlants } from './lib/use-plants';
import PlantDrawer from './components/plant-drawer';
import Fab from '@mui/material/Fab';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LANDMARKS from './data/landmarks';
import LandmarkMarker from './components/map/landmark-marker';
import { HardcodedMapObject } from './models/leaflet/hardcoded-map-object';
import { MeasurementNode } from './models/measurement-graph';
import { useGeolocation } from './lib/use-geolocation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LocationIndicator from './components/map/location-indicator';
import { distanceTo } from './lib/leaflet/distance-to';
import { useTags } from './lib/use-tags';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import TagsPicker from './components/tags-picker';
import { useSelectedTags } from './lib/use-selected-tags';
import Badge from '@mui/material/Badge';
import PlantDetails from './components/plant-details';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const FixedFab = styled(Fab)`
  position: absolute;
  z-index: 1000;
`;

function App() {
  const [plants] = usePlants();
  const [tags] = useTags();
  const [selectedTags, toggleTag] = useSelectedTags();
  const [selectedPlant, setSelectedPlant] = useState<Plant | undefined>(undefined);
  const [measurementLines, addMeasure, removeMeasurement] = useMeasurementGraph();
  const [tapeActive, setTapeActive] = useState(false);
  const [measurementNodeStart, setMeasurementNodeStart] = useState<MeasurementNode | undefined>(undefined);
  const [geolocationActive, setGeolocationActive, currentCoords] = useGeolocation();
  const [activePlantLabels, setActivePlantLabels] = useState<string[]>([]);
  const [tagsPickerOpen, setTagsPickerOpen] = useState<boolean>(false);

  const fullRenderer = useMemo(() => {
    return new SVG({ padding: 1 });
  }, []);

  const distanceToPlant = useMemo(() => {
    if (!selectedPlant || !geolocationActive || currentCoords === null) {
      return undefined;
    }

    return distanceTo(selectedPlant.position, [currentCoords.latitude, currentCoords.longitude]);
  }, [selectedPlant, geolocationActive, currentCoords]);

  const showPlantLabel = (plantId: string, show: boolean) => {
    const index = activePlantLabels.indexOf(plantId);
    let newActivePlantLabels = [...activePlantLabels];

    if (index === -1 && show) {
      newActivePlantLabels.push(plantId);
    }
    
    if (index !== -1 && !show) {
      newActivePlantLabels.splice(index, 1);
    }

    if (newActivePlantLabels.length > 30) {
      newActivePlantLabels = newActivePlantLabels.slice(-30);
    }

    setActivePlantLabels(newActivePlantLabels);
  }

  const addMeasurementNode = (measurementNode: MeasurementNode) => {
    if (measurementNodeStart === undefined) {
      setMeasurementNodeStart(measurementNode);
      return;
    }

    addMeasure(measurementNodeStart, measurementNode);
    setMeasurementNodeStart(undefined);
  }

  const plantClicked = (plant: Plant, e: MouseEvent) => {
    if (tapeActive) {
      addMeasurementNode({ id: plant.id, position: plant.position });
    }

    if (plant.id === selectedPlant?.id && !tapeActive) {
      showPlantLabel(plant.id, false);
      setSelectedPlant(undefined);
      return;
    }

    showPlantLabel(plant.id, true);
    setSelectedPlant(plant);
  }

  const landmarkClicked = (landmark: HardcodedMapObject) => {
    if (!tapeActive) {
      return;
    }

    const coords = landmark.positions[0] as LatLng;
    addMeasurementNode({ id: landmark.label, position: [coords.lat, coords.lng] })
  }

  const tapeClicked = () => {
    if (tapeActive) {
      setMeasurementNodeStart(undefined);
    }
    
    setTapeActive(!tapeActive);
  }

  return (
    <Container>
      <EditorMap>
        {POLYGONS.map(polygon => (
          <Polygon 
            key={polygon.label} 
            positions={polygon.positions} 
            pathOptions={polygon.pathOptions} 
            renderer={fullRenderer}
          />
        ))}
        {POLYLINES.map(polyline => (
          <Polyline 
            key={polyline.label} 
            positions={polyline.positions} 
            pathOptions={polyline.pathOptions} 
            renderer={fullRenderer}
          />
        ))}
        {geolocationActive && currentCoords && <LocationIndicator coords={currentCoords} renderer={fullRenderer} />}
        {plants.map(plant => (
          <PlantMarker key={plant.id}
            plant={plant}
            renderer={fullRenderer}
            selected={selectedPlant ? plant.id === selectedPlant.id : false}
            showLabel={activePlantLabels.includes(plant.id)}
            onClick={e => plantClicked(plant, e)}
            selectedTags={selectedTags} 
          />
        ))}
        {measurementLines.map(line => (
          <MeasurementPolyline 
            key={line.id} 
            line={line} 
            tooltipClick={() => {
              removeMeasurement(line.id.split('->') as [string, string])
            }}
            renderer={fullRenderer} 
          />
        ))}
        {tapeActive && LANDMARKS.map(landmark => (
          <LandmarkMarker 
            key={landmark.label} 
            landmark={landmark} 
            renderer={fullRenderer} 
            onClick={() => landmarkClicked(landmark)}
          />
        ))}
      </EditorMap>
      <FixedFab 
        sx={{ right: '16px', bottom: '72px' }} 
        color={tapeActive ? 'primary' : 'default'} 
        onClick={() => tapeClicked()}
      >
        <StraightenIcon />
      </FixedFab>
      <FixedFab 
        sx={{ right: '16px', top: '16px' }} 
        color={geolocationActive ? 'primary' : 'default'} 
        onClick={() => setGeolocationActive(!geolocationActive)}
      >
        {geolocationActive ? currentCoords ? <GpsFixedIcon /> : <LocationSearchingIcon /> : <LocationDisabledIcon />}
      </FixedFab>
      <Badge 
        badgeContent={selectedTags.length} 
        overlap="circular" 
        color="primary" 
        sx={{ position: 'absolute', zIndex: 1000, right: '16px', bottom: '144px' }}
      >
        <Fab onClick={() => setTagsPickerOpen(true)}>
          <BookmarksIcon />
        </Fab>
      </Badge>
      {(currentCoords && geolocationActive) && <Box sx={{ position: 'absolute', top: '24px', right: '88px', zIndex: 1000, backgroundColor: 'white', p: 1, borderRadius: 10 }}>
        <Typography>{(currentCoords.accuracy).toFixed(2)}&nbsp;m</Typography>
      </Box>}
      <PlantDrawer plant={selectedPlant} distanceTo={distanceToPlant}>
        {selectedPlant && <PlantDetails plant={selectedPlant} tags={tags} selectedTags={selectedTags} />}
      </PlantDrawer>
      <TagsPicker 
        open={tagsPickerOpen} 
        onClose={() => setTagsPickerOpen(false)} 
        tags={tags} 
        selectedTags={selectedTags} 
        toggleTag={toggleTag}
      />
    </Container>
  );
}

export default App;
