import React, { useState, useContext } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip as MuiTooltip,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  SportsBaseball as LiveIcon,
  Schedule as PrematchIcon,
  Receipt as BetsIcon,
  Security as RiskIcon,
  SportsSoccer as SoccerIcon,
  DarkMode,
  LightMode,
  People as UsersIcon,
  AccountCircle as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorModeContext } from '../App';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Live Matches', icon: <LiveIcon />, path: '/live-matches' },
  { text: 'Prematch Matches', icon: <PrematchIcon />, path: '/prematch-matches' },
  { text: 'Bets Management', icon: <BetsIcon />, path: '/bets' },
  { text: 'Risk Management', icon: <RiskIcon />, path: '/risk-management' },
  { text: 'User Management', icon: <UsersIcon />, path: '/users' },
];

const profileItems = [
  { text: 'My Profile', icon: <ProfileIcon />, path: '/profile' },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SoccerIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: .5 }}>
            SportsBet Pro
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ mb: 1, opacity: 0.3 }} />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selected}
                onClick={() => handleMenuClick(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: selected ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* Profile Section */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 1 }}>
        <List>
          {profileItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selected}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: selected ? 600 : 500 }}
                  />
                </ListItemButton>
                </ListItem>
            );
          })}
        </List>
      </Box>
      
      <Box sx={{ p: 2 }}>
        <MuiTooltip title={`Switch to ${theme.palette.mode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton
            onClick={colorMode.toggleColorMode}
            sx={{
              width: '100%',
              justifyContent: 'flex-start',
              borderRadius: 2,
              background: 'transparent',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': { background: 'action.hover' }
            }}
          >
            {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
              {theme.palette.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Typography>
          </IconButton>
        </MuiTooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backdropFilter: 'blur(16px)',
          background: 'transparent',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            Sportsbook Backoffice
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 25% 15%, #1f2733 0%, #0d1117 70%)'
            : 'radial-gradient(circle at 25% 15%, #e3f2fd 0%, #f5f7fb 70%)',
          transition: 'background 0.6s'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;