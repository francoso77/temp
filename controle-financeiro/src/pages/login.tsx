// src/pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Container, Typography } from '@mui/material';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });
    if (error) setErro(error.message);
    else router.push('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Senha" type="password" fullWidth margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} />
      {erro && <Typography color="error">{erro}</Typography>}
      <Button variant="contained" fullWidth onClick={handleLogin}>Entrar</Button>
      <Button fullWidth onClick={() => router.push('/cadastro')}>Criar Conta</Button>
    </Container>
  );
}
