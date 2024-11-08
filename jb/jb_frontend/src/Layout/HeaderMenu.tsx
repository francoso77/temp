import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../ContextoGlobal/ContextoGlobal';
import { Typography } from '@mui/material';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function HeaderMenu() {

  const { layoutState, setLayoutState } = React.useContext(GlobalContext) as GlobalContextInterface
  const { mensagemState, setMensagemState } = React.useContext(GlobalContext) as GlobalContextInterface

  const toggleDrawer = () => {
    setLayoutState({ ...layoutState, exibirMenu: !layoutState.exibirMenu })
  };

  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  return (
    <>
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
    </>
  );
}