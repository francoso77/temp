import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Tooltip, Typography, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CustomButton from '../../Componentes/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { ColorSelectList } from '../../Componentes/ColorSelect';
import Condicional from '../../Componentes/Condicional/Condicional';
import { AccountInterface } from '../../../../finance-backend/src/interfaces/account';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function HeaderMenu() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    layoutState,
    setLayoutState,
    mensagemState,
    setMensagemState,
    usuarioState,
    setUsuarioState
  } = React.useContext(GlobalContext) as GlobalContextInterface
  const navegar = useNavigate()

  const toggleDrawer = () => {
    setLayoutState({ ...layoutState, exibirMenu: !layoutState.exibirMenu })
  };

  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  const handleClick = (tipo: boolean) => {
    if (tipo) {
      navegar(layoutState.pathTituloAnterior)
      let _titulo: string = layoutState.titulo
      let _pathTitulo: string = layoutState.pathTitulo
      setLayoutState({
        ...layoutState,
        titulo: layoutState.tituloAnterior,
        pathTitulo: layoutState.pathTituloAnterior,
        tituloAnterior: _titulo,
        pathTituloAnterior: _pathTitulo
      })
    } else {
      setUsuarioState({ ...usuarioState, logado: false })
      navegar('/')
    }
  }

  // const [items] = React.useState<ColorItem[]>([
  //   { id: 1, name: 'Conta Corrente', color: '#ff0000' },
  //   { id: 2, name: 'Caixa', color: '#00ff00' },
  //   { id: 3, name: 'Conta Investimento', color: '#0000ff' },
  // ]);

  const handleItemChange = (selected: AccountInterface | null) => {
    console.log('Selecionado:', selected);
  };

  return (
    <>
      <AppBar sx={{ bgcolor: '#010108' }} onLoad={fecharLoading}>
        <Toolbar sx={{ mb: 2, borderBottom: '0.5px solid #3a3a3a', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
          <Tooltip title='Menu'>
            <IconButton
              color='primary'
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <CurrencyExchangeIcon sx={{ width: isMobile ? 25 : 32, height: isMobile ? 25 : 32, color: "#8280d8" }} />
            </IconButton>
          </Tooltip>
          {/* <Box>
            <CurrencyExchangeIcon sx={{ fontSize: 35, color: "#8280d8" }} />
          </Box> */}
          <Condicional condicao={!isMobile}>
            <Typography variant="h6" gutterBottom sx={{ m: '20px', color: ' #fff', textAlign: 'left' }}>
              FinanceControl
            </Typography>
            <Box >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ m: '20px', color: ' #fff', textAlign: 'left' }}>
                {layoutState.titulo}
              </Typography>
            </Box>
          </Condicional>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Box sx={{ mr: 1 }}>
            <ColorSelectList
              valorPadrao={items[0].id as number}
              label="Contas"
              items={items}
              onChange={handleItemChange}
              menuBgColor='#010108'
              corIcon='#fff'
              corTexto='#fff'
              minWidth={isMobile ? 100 : 220}
              maxHeight={isMobile ? 20 : 35}
              fontSize={isMobile ? 10 : 16}
              width={isMobile ? 10 : 16}
              height={isMobile ? 10 : 16}

            />
          </Box> */}
          <Box>
            <CustomButton
              onClick={() => navegar('/transacoes/nova')}
              bgColor='#1976d2'
              textColor='black'
              iconPosition='start'
              icon={<MonetizationOnIcon />}
              sx={{
                fontSize: isMobile ? '0.6rem' : '0.875rem',
                py: isMobile ? 0 : 0.75,
                px: isMobile ? 1 : 1
              }}

            >
              Nova Transação
            </CustomButton>
          </Box>

          <Box sx={{ marginRight: -2 }}>
            <Tooltip title='Sair'>
              <IconButton
                size="large"
                edge="end"
                color="primary"
                sx={{ mr: 1 }}
                onClick={() => handleClick(false)}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
}
