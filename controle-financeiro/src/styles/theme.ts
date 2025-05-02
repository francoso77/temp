import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // azul suave
    },
    secondary: {
      main: '#f50057', // rosa claro
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
