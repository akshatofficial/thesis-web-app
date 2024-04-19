import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  AutoStoriesOutlined,
  CenterFocusStrongOutlined,
  CollectionsBookmark,
  HomeOutlined,
  PsychologyOutlined,
} from '@mui/icons-material';
import logo from '../../assets/images/logo.png';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiPaper-root': {
    backgroundColor: '#2F667F',
    color: 'white',
    borderRadius: '18px',
    margin: '1rem',
    height: 'calc(100% - 2rem)',
  },
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function SideDrawer() {
  const [open, setOpen] = React.useState(true);

  const handleToggleDrawer = () => setOpen((prevState) => !prevState);
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open ? (
          <Stack direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h4">
              <AutoStoriesOutlined /> Thesis
            </Typography>
            <IconButton onClick={handleToggleDrawer}>
              <ChevronLeftIcon sx={{ color: 'white' }} />
            </IconButton>
          </Stack>
        ) : (
          <IconButton onClick={handleToggleDrawer}>
            <ChevronRightIcon sx={{ color: 'white' }} />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />
      <List>
        {[
          ['About', <HomeOutlined />],
          ['Research', <PsychologyOutlined />],
          ['References', <CollectionsBookmark />],
        ].map((item, index) => (
          <ListItem key={item[0]} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {item[1]}
              </ListItemIcon>
              <ListItemText primary={item[0]} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[['Prediction', <CenterFocusStrongOutlined />, () => navigate("/predict")]].map((item, index) => (
          <ListItem key={item[0]} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={item[2]}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                {item[1]}
              </ListItemIcon>
              <ListItemText primary={item[0]} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {open && (
        <List sx={{ position: 'absolute', bottom: 0, left: 0, my: '2rem' }}>
          <img src={logo} alt="logo-img" width={240} height={'150px'} />
        </List>
      )}
    </Drawer>
  );
}

export default SideDrawer;
