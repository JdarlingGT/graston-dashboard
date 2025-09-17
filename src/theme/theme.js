// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5', // A more vibrant primary color
    },
    secondary: {
      main: '#f50057', // A contrasting secondary color for accents
    },
    background: {
      default: '#1a1a2e', // A deep navy blue background
      paper: '#162447',   // A slightly lighter paper color
    },
    text: {
      primary: '#e4f9f5',
      secondary: '#a7c5c1',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
        fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Override MUI's default paper gradient
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: '#10182b',
            }
        }
    }
  },
});
