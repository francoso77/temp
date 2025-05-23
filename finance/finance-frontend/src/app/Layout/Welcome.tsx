import React from 'react';

import { Box, Container, Grid, Typography } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CustomButton from '../../Componentes/Button';
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomCard from '../../Componentes/Card';
import AddchartIcon from '@mui/icons-material/Addchart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';

export function Welcome() {
  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          py: 2,
          px: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'space-between' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            mb: { xs: 2, sm: 0 },
          }}
        >
          <CurrencyExchangeIcon sx={{ fontSize: 35, color: "#8280d8" }} />
          <Typography sx={{ ml: { sm: 2 }, fontSize: 25, fontWeight: 'bold' }}>
            FinanceControl
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CustomButton
            bgColor="#292123"
            textColor="#fff"
            href="/login"
            icon={<LoginIcon />}
            sx={{ mr: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }}
          >
            Entrar
          </CustomButton>
          <CustomButton
            bgColor="#8280d8"
            textColor="black"
            href="/registrar"
            icon={<PersonAddAltIcon />}
            sx={{ mr: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }}

          >
            Registrar
          </CustomButton>
        </Box>
      </Container>


      <Container sx={{ py: 2, px: 1, mt: 3, alignItems: 'center' }} >
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h1" sx={{ ml: 15, mr: 15, fontSize: 50, fontWeight: 'bold', textAlign: 'center' }}>
            Gerencie suas finanças com simplicidade e eficiência
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mt: 2, ml: 15, mr: 15, fontSize: 20, textAlign: 'center' }}>
            FinanceControl é uma plataforma completa para controle financeiro pessoal e empresarial. Acompanhe receitas, despesas e investimentos em um só lugar.
          </Typography>

        </Box >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>

          <CustomButton
            bgColor="#8280d8"
            textColor="black"
            href="/registrar"
            icon={<ArrowForwardIosIcon />}
            iconPosition='end'
            sx={{ mr: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 }, fontSize: 20 }}

          >
            Começar agora
          </CustomButton>
        </Box>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mt: 5, mb: 5 }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              bgColor='#1b1935'
              iconColor="#8280d8"
              titleColor='white'
              descriptionColor='white'
              borderRadius={2}
              icon={<AddchartIcon />}
              iconSize={50}
              title="Relatórios Detalhados"
              subtitle="Visualize seus dados financeiros com gráficos interativos e relatórios personalizados."
              description="Acompanhe a evolução do seu patrimônio, identifique padrões de gastos e tome decisões baseadas em dados. Nossos relatórios são atualizados em temo real."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              bgColor='#1b1935'
              iconColor="green"
              titleColor='white'
              descriptionColor='white'
              borderRadius={2}
              icon={<QueryStatsIcon />}
              iconSize={50}
              title="Controle de Transações"
              subtitle="Registre e categorize todas as suas transações financeiras em um só lugar."
              description="Adicione receitas e despesas facilmente, organize por categorias e empresas, e mantenha um histórico completo de todas as suas movimentações financeiras."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CustomCard
              bgColor='#1b1935'
              iconColor="purple"
              titleColor='white'
              descriptionColor='white'
              borderRadius={2}
              icon={<PieChartOutlineIcon />}
              iconSize={50}
              title="Gestão de Categorias"
              subtitle="Organize suas finanças com categorias personalizadas para melhor controle."
              description="Crie e gerencie categorias para classificar suas transações. Visualize a distribuição de gastos e receitas por categoria com gráficos intuitivos."
            />
          </Grid>
        </Grid>
      </Container >
      <Container sx={{ py: 2, px: 1, mt: 3, alignItems: 'center', bgcolor: '#1b1a29' }} >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ ml: 15, mr: 15, fontSize: 50, fontWeight: 'bold', textAlign: 'center' }}>
            Pronto para começar?
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mt: 2, ml: 15, mr: 15, fontSize: 20, textAlign: 'center' }}>
            Experimente o FinanceControl hoje mesmo e transforme a maneira como você gerencia suas finanças.          </Typography>

        </Box >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>

          <CustomButton
            bgColor="#8280d8"
            textColor="black"
            href="/registrar"
            sx={{ mr: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 }, fontSize: 20 }}

          >
            Crie uma conta gratuita
          </CustomButton>
        </Box>
      </Container >
      <Typography variant="body2" color="inherit" sx={{ fontSize: 12, mt: 2, textAlign: 'center' }} >
        {new Date().getFullYear()}
        {' © FinanceControl. Todos os direitos reservados. '}
      </Typography>
    </>
  )
}