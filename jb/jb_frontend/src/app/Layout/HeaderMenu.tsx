import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Tooltip, Typography } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import { UsuarioType } from '../../types/usuarioTypes';




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

  const verificarTipoUsuario = () => {
    let tipoUsuario: any = usuarioState.tipoUsuario
    const estoquista: number = UsuarioType.estoquistaMalharia
    const admin: number = UsuarioType.admin
    tipoUsuario = Number(tipoUsuario)
    return tipoUsuario === admin || tipoUsuario === estoquista
  }

  React.useEffect(() => {
    verificarTipoUsuario()
  }, [])

  return (
    <>
      <Condicional condicao={verificarTipoUsuario()}>
        <AppBar onLoad={fecharLoading}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box >
              <Typography variant="body1" gutterBottom sx={{ margin: '20px' }}>
                {layoutState.titulo}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <img src="img/logomarca.png" width={55} alt="logo tipo da empresa JB Textl" />
            </Box>
          </Toolbar>
        </AppBar>
        <Offset />
      </Condicional>
      <Condicional condicao={!verificarTipoUsuario()}>
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

      </Condicional>
    </>
  );
}
