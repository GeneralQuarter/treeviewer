import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import { FC, useState } from 'react';

type Tag = { id: string, label: string };

interface TagSearchProps {
  tags: Tag[];
  onTagClick: (tag: Tag) => void;
  disabled: boolean;
}

const TagSearch: FC<TagSearchProps> = ({ tags, onTagClick, disabled }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<Tag | null>(null);

  return <Autocomplete 
    freeSolo
    options={tags}
    disabled={disabled}
    value={value}
    inputValue={inputValue}
    noOptionsText="No tags"
    onInputChange={(e, newValue) => {
      if (e.type === 'click' && (e.target as any).localName === 'li') {
        return;
      }

      setInputValue(newValue);
    }}
    getOptionLabel={o => o.label}
    autoHighlight
    fullWidth
    onChange={(_, value) => {
      if (!value || typeof value === 'string') {
        return;
      }

      setValue(null);
      onTagClick(value);
    }}
    renderInput={({InputProps, InputLabelProps, ...params}) => (
      <InputBase 
        {...params}
        {...InputProps}
        placeholder={disabled ? 'Tag limit reached' : 'Search Tags'}
        sx={{ color: 'inherit' }}
      />
    )}
  />;
}

export default TagSearch;