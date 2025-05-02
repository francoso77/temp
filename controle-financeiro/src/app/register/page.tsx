'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });
    console.log('DATA:', data);
    console.log('ERROR:', error);

    if (error) {
      setErro(error.message);
      setSucesso('');
    } else {
      setSucesso('Cadastro realizado com sucesso!');
      setErro('');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>Criar Conta</Typography>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <Typography color="error">{erro}</Typography>}
        {sucesso && <Typography color="primary">{sucesso}</Typography>}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleRegister}
          sx={{ mt: 2 }}
        >
          Cadastrar
        </Button>
        <Button fullWidth sx={{ mt: 1 }} onClick={() => router.push('/')}>
          Já tenho conta
        </Button>
      </Box>
    </Container>
  );
}
