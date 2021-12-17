import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FC } from 'react';
import { colorFromHueIndex } from '../lib/color-from-hue-index';

interface TagPickerListProps {
  subheader: string;
  tags: {
    id: string;
    label: string;
    hueIndex?: number;
  }[];
  tagClicked: (id: string) => void;
}

const TagPickerList: FC<TagPickerListProps> = ({ subheader, tags, tagClicked }) => {
  return <List
    subheader={
      <ListSubheader component="div">
        {subheader}
      </ListSubheader>
    }
    sx={{ overflowY: 'auto' }}
  >
    {tags.map(tag => (
      <ListItem
        key={tag.id}
        disablePadding
        sx={{ backgroundColor: tag.hueIndex !== undefined ? colorFromHueIndex(tag.hueIndex) : 'inherit' }}
      >
        <ListItemButton
          role='button'
          onClick={() => tagClicked(tag.id)}
        >
          <ListItemText primary={tag.label} />
        </ListItemButton>
      </ListItem>
    ))}
  </List>;
}

export default TagPickerList;