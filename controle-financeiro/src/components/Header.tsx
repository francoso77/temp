'use client';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Controle Financeiro
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}

