import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Select, Tooltip, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CustomButton from '../../Componentes/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InputSelect from '../../Componentes/Select';
import CircleIcon from '@mui/icons-material/Circle';
import { ColorItem, ColorSelectList } from '../../Componentes/ColorSelect';






const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function HeaderMenu() {

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

  const [items, setItems] = React.useState<ColorItem[]>([
    { id: 1, name: 'Conta Corrente', color: '#ff0000' },
    { id: 2, name: 'Caixa', color: '#00ff00' },
    { id: 3, name: 'Conta Investimento', color: '#0000ff' },
  ]);

  const handleItemChange = (selected: ColorItem | null) => {
    console.log('Selecionado:', selected);
  };

  return (
    <>
      <AppBar sx={{ bgcolor: '#010108' }} onLoad={fecharLoading}>
        <Toolbar sx={{ mb: 2, borderBottom: '0.5px solid #3a3a3a', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
          {/* <Tooltip title='Menu'>
            <IconButton
              color='primary'
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip> */}
          <Box>
            <CurrencyExchangeIcon sx={{ fontSize: 35, color: "#8280d8" }} />
          </Box>
          <Typography variant="h6" gutterBottom sx={{ m: '20px', color: ' #fff', textAlign: 'left' }}>
            FinanceControl
          </Typography>
          <Box >
            <Typography variant="h6" gutterBottom sx={{ m: '20px', color: ' #fff', textAlign: 'left' }}>
              {layoutState.titulo}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ mr: 1 }}>
            <ColorSelectList
              valorPadrao={items[0].id as number}
              label="Contas"
              items={items}
              onChange={handleItemChange}
              menuBgColor='#010108'
              corIcon='#fff'
              corTexto='#fff'

            />
          </Box>
          <Box>
            <CustomButton
              onClick={() => navegar('/')}
              bgColor='#1976d2'
              textColor='black'
              iconPosition='start'
              icon={<MonetizationOnIcon />}
              sx={{ mr: '10px' }}
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

      {/* <Condicional condicao={!verificarTipoUsuario()}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar onLoad={fecharLoading} color='primary' >
            <Toolbar>
              <Tooltip title='Voltar'>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{ mr: 2 }}
                  onClick={() => handleClick(true)}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Tooltip>
              <Box sx={{ flexGrow: 1 }} />
              <Box >
                <Typography variant="body1" gutterBottom sx={{ margin: '20px' }}>
                  {layoutState.titulo}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ marginRight: -2 }}>
                <Tooltip title='Sair'>
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
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
        </Box>
      </Condicional> */}
    </>
  );
}
