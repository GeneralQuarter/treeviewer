import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { FC } from 'react';
import { Plant } from '../models/plant';
import Chip from '@mui/material/Chip';

interface PlantDetailsProps {
  plant: Plant;
}

const PlantDetails: FC<PlantDetailsProps> = ({ plant }) => {
  return <Stack>
    <Typography variant="h5">{plant.fullLatinName}</Typography>
    <Typography variant="subtitle1">{plant.commonName}</Typography>
    <Typography mt={1}>{plant.height}&nbsp;m x {plant.width}&nbsp;m</Typography>
    <Stack flexDirection="row" gap={1} mt={2} flexWrap="wrap">
      {plant.tags.map(tag => (
        <Chip key={tag} label={tag} />
      ))}
    </Stack>
  </Stack>;
}

export default PlantDetails;