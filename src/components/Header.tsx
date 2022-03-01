import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../App';
import { useNavigate, useLocation } from "react-router-dom";
import _ from 'lodash';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ImgWithSkeleton from './ImgWithSkeleton';

import Account from '../api/account';
import { baseURL } from '../constant/parameter';
import isEmptyString from '../util/isEmptyString';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function Header({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, resetSocket } = useContext(SocketContext);

  const [imgLoaded, setImgLoaded] = useState<boolean[]>([false]);
  const [keyword, setKeyword] = useState('');

  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [notifications, setNotifications] = useState<{ title: string, vid: string, channel: string }[]>([]);


  const [anchorProfileEl, setAnchorProfileEl] = useState<null | HTMLElement>(null);
  const [anchorNotificationEl, setAnchorNotificationEl] = useState<null | HTMLElement>(null);


  const isMenuOpen = Boolean(anchorProfileEl);
  const isNotificationOpen = Boolean(anchorNotificationEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorProfileEl(event.currentTarget);
  };

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotificationEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorProfileEl(null);
  };


  const handleNotificationClose = () => {
    setAnchorNotificationEl(null);
  };

  const handleRedirct = (path: string) => {
    handleMenuClose();
    handleNotificationClose();
    navigate(path, { state: { from: location } });
  };



  useEffect(() => {
    if (!_.isUndefined(socket)) {
      setIsloggedIn(true);
      const onNewVideo = (videoInfo: { vid: string, title: string, channel: string }) => {
        setNotifications(prve => [videoInfo, ...prve]);
      }
      socket.on("new_video", onNewVideo);
      return () => {
        socket.off("new_video", onNewVideo);

      }
    }
    setIsloggedIn(false);

  }, [socket])


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorProfileEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isLoggedIn
        ? [
          <MenuItem key={'MenuItem_1'} onClick={() => handleRedirct('/channel/library')}>Channel</MenuItem>,
          <MenuItem key={'MenuItem_2'} onClick={() => {
            Account.Logout()
              .then(() => {
                socket?.disconnect();
                resetSocket();
                handleRedirct('/');
              })
          }
          }>Sign Out</MenuItem>
        ]
        : <MenuItem onClick={() => handleRedirct('/signIn')}>Sign In</MenuItem>
      }
    </Menu>
  );

  const renderNotifications = (
    <Menu
      anchorEl={anchorNotificationEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationOpen}
      onClose={handleNotificationClose}
    >
      {
        _.isEmpty(notifications)
          ? <MenuItem onClick={handleNotificationClose}>
            <Typography variant='body2' gutterBottom >{'沒有新通知'}</Typography>
          </MenuItem>
          : _.map(notifications, (n, index) =>
            <MenuItem key={`notification_${index}`} onClick={() => handleRedirct(`/watch/${n.vid}`)}>
              <Box >
                <Typography variant='body2' gutterBottom >{`${n.channel} 上傳了新影片：`}</Typography>
                <Typography variant='body2' >{`「${n.title}」`}</Typography>
              </Box>

              <Box width={100} marginLeft={2}>

                <ImgWithSkeleton
                  height={100 / 1.3}
                  src={`${baseURL}/api/channel/video/cover/${n.vid}`}
                  imgLoaded={imgLoaded} setImgLoaded={setImgLoaded} index={0} />
              </Box>
            </MenuItem>
          )
      }

    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
      <AppBar position="static">
        <Toolbar>

          <Typography
            variant="h6"
            noWrap
            component={Button}
            disableRipple
            onClick={() => handleRedirct('/')}
            sx={{ display: { xs: 'none', sm: 'block', color: 'white' } }}
          >
            Video Share
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13 && !isEmptyString(keyword)) {
                    navigate(`/search/${keyword}`);
                  }
                }
              }
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            {
              isLoggedIn &&
              <>
                <Typography key={'userNme'} variant='h6'>{`Hello ${userName}！`}</Typography>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationOpen}
                  sx={{ marginLeft: 5 }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </>
            }
            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>

        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderNotifications}
    </Box >
  );
}