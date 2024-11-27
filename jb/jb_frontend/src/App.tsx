import { THEME } from './admin/Layout/Theme';
import { CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  return (
    <>
      <ThemeProvider theme={THEME}>
        <CssBaseline />
      </ThemeProvider>
    </>
  )
}

export default App;
