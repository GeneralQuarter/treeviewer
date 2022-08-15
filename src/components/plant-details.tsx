import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FC, useCallback } from 'react';
import { Plant } from '../models/plant';
import Chip from '@mui/material/Chip';
import { Tags } from '../models/tags';
import { SelectedTag } from '../models/selected-tag';
import { colorFromHueIndex } from '../lib/color-from-hue-index';

interface PlantDetailsProps {
  plant: Plant;
  tags: Tags;
  selectedTags: SelectedTag[];
}

const PlantDetails: FC<PlantDetailsProps> = ({ plant, tags, selectedTags }) => {
  const getBgColor = useCallback((tagId: string) => {
    const firstSelectedTag = selectedTags.find(t => t.id === tagId);

    if (!firstSelectedTag) {
      return null;
    }

    return colorFromHueIndex(firstSelectedTag.hueIndex);
  }, [selectedTags])
  return <Stack>
    <Typography variant="h5">{plant.fullLatinName}</Typography>
    <Typography variant="subtitle1">{plant.commonName}</Typography>
    <Typography mt={1}>{plant.height}&nbsp;m x {plant.width}&nbsp;m</Typography>
    <Stack flexDirection="row" gap={1} mt={2} flexWrap="wrap">
      {plant.tags.map(tag => (
        <Chip key={tag} label={tags[tag]} sx={{ backgroundColor: getBgColor(tag) }}/>
      ))}
    </Stack>
  </Stack>;
}

export default PlantDetails;