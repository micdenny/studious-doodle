import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

const baseOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
          backdropFilter: 'blur(18px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
          boxShadow: '0 4px 16px -2px rgba(0,0,0,0.4)',
          transition: 'border-color .25s, transform .25s',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            transform: 'translateY(-2px)'
          }
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
        })
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
          boxShadow: '0 2px 12px -2px rgba(0,0,0,0.5)'
        })
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.85)} 0%, ${alpha(theme.palette.background.paper, 0.65)} 100%)`,
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        })
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          margin: '4px 8px',
          '&.Mui-selected': {
            background: alpha(theme.palette.primary.main, 0.15),
            color: theme.palette.primary.main,
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.main,
            }
          },
          '&:hover': {
            background: alpha(theme.palette.primary.main, 0.08)
          }
        })
      }
    },
    MuiChip: {
      defaultProps: { variant: 'filled' },
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 600,
          backdropFilter: 'blur(10px)'
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', transform: 'translateY(-1px)' },
          transition: 'transform .2s'
        })
      }
    }
  }
};

export const getAppTheme = (mode: 'light' | 'dark') => {
  const dark = mode === 'dark';
  return createTheme({
    ...baseOptions,
    palette: {
      mode,
      primary: { main: dark ? '#4FC3F7' : '#1976d2' },
      secondary: { main: dark ? '#AB47BC' : '#dc004e' },
      accent: { main: dark ? '#00BFA5' : '#00897B' },
      background: {
        default: dark ? '#0d1117' : '#f5f7fb',
        paper: dark ? '#161b22' : '#ffffff'
      },
      divider: dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    },
  });
};

export type ColorMode = 'light' | 'dark';

export {}; // ensure this file is treated as a module when isolatedModules is on
