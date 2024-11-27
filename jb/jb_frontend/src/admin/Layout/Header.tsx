import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function Header() {
  const { layoutState, setLayoutState } = React.useContext(GlobalContext) as GlobalContextInterface
  const { mensagemState, setMensagemState } = React.useContext(GlobalContext) as GlobalContextInterface
  const { usuarioState, setUsuarioState } = React.useContext(GlobalContext) as GlobalContextInterface
  const navegar = useNavigate()
  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  const handleClick = (tipo: boolean) => {
    if (tipo) {
      navegar(layoutState.pathTituloAnterior)
      let _titulo: string = layoutState.titulo
      let _pathTitulo: string = layoutState.pathTitulo
      setLayoutState({
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
  return (
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
  );
}