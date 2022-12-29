import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, ReactElement, Ref, useCallback, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Tags } from '../models/tags';
import { SelectedTag } from '../models/selected-tag';
import TagPickerList from './tag-picker-list';
import Stack from '@mui/material/Stack';
import TagSearch from './tag-search';
import { HUE_FRACTIONS } from '../data/colors';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TagsPickerProps {
  open: boolean;
  onClose?: () => void;
  tags: Tags;
  selectedTags: SelectedTag[];
  toggleTag: (tagId: string) => void;
}

const TagsPicker: FC<TagsPickerProps> = ({ open, onClose, tags, selectedTags, toggleTag }) => {
  const closePicker = useCallback(() => {
    return onClose?.();
  }, [onClose]);

  const selectedTagList = useMemo(() => {
    return selectedTags
      .map(({ id, hueIndex }) => ({ id, label: tags[id], hueIndex }))
      .sort((a, b) => -b.label.localeCompare(a.label));
  }, [tags, selectedTags])

  const tagList = useMemo(() => {
    return Object.entries(tags)
      .map(([k, v]) => ({id: k, label: v}))
      .filter(t => !selectedTags.some(st => st.id === t.id))
      .sort((a, b) => -b.label.localeCompare(a.label));
  }, [tags, selectedTags]);

  return <Dialog 
    fullScreen
    open={open}
    TransitionComponent={Transition}
    onClose={closePicker}
  >
    <Stack sx={{ height: '100vh', overflow: 'hidden' }}>
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={closePicker}
          >
            <ArrowBackIcon />
          </IconButton>
          <TagSearch tags={tagList} onTagClick={tag => toggleTag(tag.id)} disabled={selectedTagList.length >= HUE_FRACTIONS} />
        </Toolbar>
      </AppBar>
      <TagPickerList subheader={`${selectedTagList.length} tag${selectedTagList.length > 1 ? 's' : ''} sélectioné${selectedTagList.length > 1 ? 's' : ''}`} tagClicked={tagId => toggleTag(tagId)} tags={selectedTagList} />
    </Stack>
  </Dialog>;
}

export default TagsPicker;