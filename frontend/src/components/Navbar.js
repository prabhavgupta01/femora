import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import authService from '../services/authService';
import ChatIcon from '@mui/icons-material/Chat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = authService.getCurrentUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Track Cycle', icon: <CalendarMonthIcon />, path: '/cycle-tracking' },
    { label: 'Track Discharge', icon: <AssessmentIcon />, path: '/discharge-tracking' },
    { label: 'Luna', icon: <ChatIcon />, path: '/chat' },
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: 'none',
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        backdropFilter: 'blur(10px)',
        backgroundColor: alpha(theme.palette.primary.main, 0.95)
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo and Brand */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
          onClick={() => navigate('/dashboard')}
        >
          <img 
            src="/images/logo.png" 
            alt="Femora Logo" 
            style={{ 
              height: '48px',
              width: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
              transition: 'all 0.3s ease-in-out',
              border: `3px solid ${alpha(theme.palette.common.white, 0.3)}`,
              padding: '3px',
              backgroundColor: alpha(theme.palette.common.white, 0.15)
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FFFFFF, #F0F0F0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}
          >
            Femora
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {navItems.map((item, index) => (
            <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }} key={item.label}>
              <Tooltip title={item.label} arrow>
                <Button
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    mx: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  {item.label}
                </Button>
              </Tooltip>
            </Fade>
          ))}

          {/* User Menu */}
          <Fade in timeout={500} style={{ transitionDelay: '500ms' }}>
            <Tooltip title="Account" arrow>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Fade>
        </Box>

        {/* User Menu Popup */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 200 }}
        >
          <MenuItem 
            onClick={handleProfile}
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            Profile
          </MenuItem>
          <MenuItem 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 