import React from 'react';
import { useNavigate } from 'react-router-dom';
import MUIAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const drawerWidth = 240;
const appBarHeight = 80;

export default function AppBar(props) {
  const navigate = useNavigate()

  const drawer = (
    <Box sx={{
      position: "absolute",
      top: appBarHeight,
    }}>
      {props.menu.map((list, listIndex) => (
        <Box key={listIndex}>
          <List key={listIndex}>
            {list.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => navigate(item.link || '/')}>
                  {item.icon !== undefined && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.text || 'Undefined link'} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {listIndex < props.menu.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MUIAppBar
        position="fixed"
        sx={{
          m: 0,
          display: {
            xs: 'none',
            sm: 'block'
          },
          '& .MuiToolbar-root': {
            m: 0, p: 0,
            boxSizing: 'border-box',
            height: appBarHeight,
            zIndex: 101
          },
        }}
      >
        <Box
          component="div"
          sx={{
            width: "100%",
            height: { sm: appBarHeight },
            flexShrink: { sm: 0 },
          }}
        >
          <Toolbar>
            <Typography sx={{
              textAlign: "center",
              width: { sm: `${drawerWidth}px` },
              fontSize: 25,
              fontWeight: "bold",
            }}>
              VOTIFY
            </Typography>
          </Toolbar>
        </Box>
      </MUIAppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: {
              xs: 'none',
              sm: 'block'
            },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              zIndex: 100
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: { sm: `calc(100% - ${appBarHeight}px)` },
          position: "absolute",
          top: appBarHeight,
          left: drawerWidth,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}
