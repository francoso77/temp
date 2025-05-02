'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '@/components/Header';
import theme from '@/styles/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

