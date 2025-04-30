import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../Context/GlobalContext';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function Header() {

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
          <Box sx={{ flexGrow: 1 }}>
            <img src="img/tamborDogFundo.png" width={80} alt="logotipo da TamborDog" />
          </Box>

        </Toolbar>
      </AppBar>
      <Offset />
    </>
  );
}
