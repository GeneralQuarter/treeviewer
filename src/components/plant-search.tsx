import { FilterOptionsState } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FC, useState } from 'react';
import { Plant } from '../models/plant';

interface PlantSearchProps {
  plants: Plant[];
  onPlantClicked: (plant: Plant) => void;
}

const PlantSearch: FC<PlantSearchProps> = ({ plants, onPlantClicked }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<Plant | null>(null);

  const filterPlants = (options: Plant[], state: FilterOptionsState<Plant>): Plant[] => {
    const term = (state.inputValue ?? '').trim().toLowerCase();

    return options.filter(p => {
      return p.code.toLowerCase().includes(term) 
        || p.fullLatinName.toLowerCase().includes(term) 
        || p.commonName.toLowerCase().includes(term)
    }).sort((p1, p2) => p1.code.localeCompare(p2.code)).slice(0, 15);
  }

  return <Autocomplete 
    freeSolo
    options={plants}
    value={value}
    inputValue={inputValue}
    filterOptions={filterPlants}
    noOptionsText={`No results for "${inputValue}"`}
    onInputChange={(_, newValue) => setInputValue(newValue)}
    getOptionLabel={o => o.code}
    autoHighlight
    fullWidth
    clearOnBlur
    blurOnSelect
    onChange={(_, value) => {
      if (!value || typeof value === 'string') {
        return;
      }

      setValue(null);
      setInputValue('');
      onPlantClicked(value);
    }}
    renderInput={({InputProps, InputLabelProps, ...params}) => (
      <InputBase 
        {...params}
        {...InputProps}
        placeholder="Search"
        sx={{ color: 'inherit' }}
      />
    )}
    renderOption={(props, option) => (
      <Box component="li" {...props}>
        <Stack>
          <Typography variant="body2" component="div">
            {option.commonName}
          </Typography>
          <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
            {option.code}
          </Typography>
          <Typography variant="subtitle2" component="div">
            {option.fullLatinName}
          </Typography>
        </Stack>
      </Box>
    )}
  />;
}

export default PlantSearch;