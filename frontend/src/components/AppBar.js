import React from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
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
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import authenticate from './api/authenticate';
import Utils from './utils';

const drawerWidth = 240;
const appBarHeight = 80;

export default function AppBar(props) {
  const [user, setUser] = React.useState(undefined)
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const navigate = useNavigate()
  const location = useLocation()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const userSettings = [
    {
      text: 'Log out',
      onClick: () => {
        localStorage.removeItem('jwt_token');
        navigate(location.pathname)
      }
    }
  ]

  React.useEffect(() => {
    (async () => {
      try {
        const user = await authenticate(navigate, location)
        setUser(user)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [navigate, location])

  const drawer = (
    <Box sx={{
      position: "absolute",
      top: appBarHeight,
    }}>
      {props.menu.map((list, listIndex) => (
        <Box key={listIndex}>
          <List key={listIndex}>
            {list.map((item, index) => (
              item.text !== undefined && 
              (<ListItem key={index} disablePadding>
                <ListItemButton onClick={() => navigate(item.link || '/')}>
                  {item.icon !== undefined && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.text || 'Undefined link'} />
                </ListItemButton>
              </ListItem>)
            ))}
          </List>
          {listIndex < props.menu.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );

  return user === undefined ? <></> : (
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
            zIndex: 101,
            justifyContent: "space-between"
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
              cursor: "default"
            }}>
              VOTIFY
            </Typography>
            <Box sx={{ flexGrow: 0, mr: 5 }}>
              {user !== undefined &&
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar {...Utils.stringAvatar(user.username)} />
                </IconButton>
              }
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {userSettings.map((item, index) => (
                  <MenuItem key={index} onClick={handleCloseUserMenu}>
                    <Typography
                      textAlign="center"
                      onClick={item.onClick}>
                      {item.text}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
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
        <Routes>
          {props.menu.map((list) => (
            list.map((elem) => (
              <Route path={elem.link} element={<elem.component user={user} />} />
            ))
          ))}
        </Routes>
      </Box>
    </Box>
  );
}
