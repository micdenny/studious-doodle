import { createTheme, ThemeOptions } from '@mui/material/styles';
import { alpha } from '@mui/material';
import { colorTokens } from '../tokens/colors';
import { typographyTokens } from '../tokens/typography';
import { spacingTokens } from '../tokens/spacing';

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
    fontFamily: typographyTokens.fontFamily,
    ...typographyTokens.headings,
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: spacingTokens.borderRadius },
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
          background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
          backdropFilter: 'blur(10px)'
        })
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          margin: '2px 8px',
          fontWeight: 600,
          backdropFilter: 'blur(10px)'
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: spacingTokens.cardBorderRadius,
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
  const isDark = mode === 'dark';
  const colors = isDark ? colorTokens.dark : colorTokens.light;
  
  return createTheme({
    ...baseOptions,
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.secondary },
      accent: { main: colors.accent },
      background: {
        default: colors.background.default,
        paper: colors.background.paper
      },
      divider: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    },
  });
};

export type ColorMode = 'light' | 'dark';

export {}; // ensure this file is treated as a module when isolatedModules is on