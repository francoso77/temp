import React from 'react';
import { Box, Button, Typography, AppBar, Toolbar, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <Box>
      {/* Barra Superior */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Indústria Têxtil Circular
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Conteúdo */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Texto de Introdução */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Bem-vindo ao Sistema de Gestão Têxtil
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'justify', mb: 2 }}>
              A indústria têxtil circular, também conhecida como tubular, é especializada na produção de malhas
              e tecidos de alta qualidade. Nosso sistema oferece controle total sobre o fluxo de produção, desde
              a gestão de matérias-primas até a expedição dos produtos acabados.
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'justify', mb: 2 }}>
              Explore nossa plataforma para gerenciar seus estoques, acompanhar pedidos e otimizar a produção.
              Um sistema ideal para vendedores, estoquistas, operadores de produção e administradores.
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                component={Link}
                to="/Usuario"
                sx={{ bgcolor: '#007BFF', '&:hover': { bgcolor: '#0056b3' } }}
              >
                Cadastrar
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/Login"
                sx={{ color: '#007BFF', borderColor: '#007BFF', '&:hover': { borderColor: '#0056b3' } }}
              >
                Login
              </Button>
            </Box>
          </Grid>

          {/* Imagem ou Slider */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src="/path/to/your/image1.jpg"
                alt="Máquina Têxtil"
                style={{ width: '100%', borderRadius: 8 }}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Vídeo (opcional) */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Conheça nossa Indústria em Ação
          </Typography>
          <Box component="video" controls width="100%" sx={{ borderRadius: 4 }}>
            <source src="/path/to/your/video.mp4" type="video/mp4" />
            Seu navegador não suporta o vídeo.
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
