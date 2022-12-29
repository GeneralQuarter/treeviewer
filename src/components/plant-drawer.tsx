import { FC, PropsWithChildren, useMemo, useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Plant } from '../models/plant';
import Stack from '@mui/material/Stack';
import { green, orange, red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import GradeIcon from '@mui/icons-material/Grade';

const drawerBleeding = 56;

const WhiteBox = styled(Box)`
  background-color: #fff;
`;

interface PlantDrawerProps {
  plant?: Plant;
  distanceTo?: number;
  toggleMarked: (plantId: string) => void;
}

const PlantDrawer: FC<PropsWithChildren<PlantDrawerProps>> = ({ plant, distanceTo, children, toggleMarked }) => {
  const [open, setOpen] = useState<boolean>(false);
  const distanceColor = useMemo(() => {
    if (!distanceTo) {
      return 'black';
    }

    if (distanceTo < 0.5) {
      return green[800];
    }

    if (distanceTo < 1) {
      return orange[800];
    }

    return red[800];
  }, [distanceTo]);

  const markColor = useMemo(() => {
    if (!plant) {
      return 'default';
    }

    return plant.tags.includes('__marked__') ? 'warning' : 'default';
  }, [plant]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const markClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!plant) {
      return;
    }

    toggleMarked(plant.id);
  };

  return <SwipeableDrawer 
    open={open}
    onOpen={toggleDrawer(true)}
    onClose={toggleDrawer(false)}
    anchor="bottom"
    swipeAreaWidth={drawerBleeding}
    disableSwipeToOpen={false}
    ModalProps={{
      keepMounted: true,
    }}
  >
    <WhiteBox
      sx={{
        position: 'absolute',
        top: -drawerBleeding,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        visibility: 'visible',
        right: 0,
        left: 0,
        width: '100%',
        pointerEvents: 'auto'
      }}
      onClick={() => {
        if (!open && !plant) {
          return;
        }
        
        setOpen(!open)
      }}
    >
      <Stack direction="row" alignItems="center">
        <Typography 
          sx={{ 
            p: 2, 
            color: plant ? 'text.primary' : 'text.secondary', 
            fontWeight: plant ? 'bold' : 'normal', 
          }}
        >{plant ? plant.code : 'Sélectionner une plante'}</Typography>
        {distanceTo !== undefined && <Typography 
          sx={{ 
            fontWeight: 500, 
            fontSize: '1.5rem', 
            lineHeight: 1.75, 
            letterSpacing: 0, 
            ml: 'auto', 
            mr: 2, 
            color: distanceColor 
          }}>{distanceTo.toFixed(2)}&nbsp;m</Typography>}
          <IconButton color={markColor} sx={{mr: 2, ml: distanceTo !== undefined ? 'none' : 'auto'}} onClick={e => markClick(e as any)}>
            <GradeIcon />
          </IconButton>
      </Stack>
    </WhiteBox>
    <WhiteBox
      sx={{
        px: 2,
        pb: 2,
        height: '100%',
        overflow: 'auto',
      }}
    >
      {children}
    </WhiteBox>
  </SwipeableDrawer>
}

export default PlantDrawer;