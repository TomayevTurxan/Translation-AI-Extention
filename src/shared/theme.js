import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3b82f6' },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    background: { default: '#080b10', paper: '#0d1218' },
    divider: '#1a212b',
    text: { primary: '#e6edf5', secondary: '#7d8a9b' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Lexend', 'Inter', system-ui, sans-serif",
    button: { textTransform: 'none', fontWeight: 500 },
  },
});
