import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { darkTheme } from '../shared/theme';
import App from './App';

const grid = {
  body: {
    backgroundImage:
      'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)',
    backgroundSize: '46px 46px',
  },
};

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <GlobalStyles styles={grid} />
    <App />
  </ThemeProvider>
);
