'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Container, TextField, Button, Typography } from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro('Credenciais inválidas');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Senha"
        type="password"
        fullWidth
        margin="normal"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      {erro && <Typography color="error">{erro}</Typography>}
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Entrar
      </Button>
      <Button sx={{ justifyContent: 'end' }} variant="contained" color="primary" onClick={() => router.push('/register')}>
        Criar uma conta
      </Button>

    </Container>
  );
}
