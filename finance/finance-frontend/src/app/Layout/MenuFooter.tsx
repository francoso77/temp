import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ButtonMenuFooter from '../../Componentes/ButtonMenuFooter';
import menuFooter from '../../Utils/menuFooter.json';
import { iconMap } from '../../Utils/IconsMenuFooter';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function MenuFooter() {

  const {
    mensagemState,
    setMensagemState,
    layoutState,
    setLayoutState,
  } = React.useContext(GlobalContext) as GlobalContextInterface

  const navigate = useNavigate()
  const irPara = (url: string, titulo: string) => {
    setLayoutState({
      ...layoutState,
      titulo: titulo,
      pathTitulo: url
    })
    navigate(url)
  }

  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  return (
    <>
      <Offset />
      {/* <Paper
        sx={{
          position: "fixed",
          bottom: 16,
          left: { xs: "25%", md: "30%", lg: "40%" },
          transform: "translateX(-50%)",
          borderRadius: "2rem",
          boxShadow: 6,
          zIndex: 1300,
        }}
        elevation={3}
      > */}
      <AppBar
        onLoad={fecharLoading}
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 8,
          backgroundColor: "#3a3a3a", // fundo claro
          color: "#000000",           // texto/ícone escuro
          borderRadius: "2rem 2rem 2rem 2rem ",
          left: { xs: "50%" },
          transform: "translateX(-50%)",
          width: { xs: "90%", sm: "80%", md: "60%" },
          boxShadow: 6,
          zIndex: 1300,
        }}
        color="default"
      >
        <Toolbar>
          {menuFooter
            //.filter((data) => usuarioState.idsMenu.includes(data.id))
            .map((menu, index) => (
              <ButtonMenuFooter
                key={index}
                tooltipTitle={menu.tooltipTitle}
                icon={iconMap[menu.icon]}
                iconSize={menu.iconSize}
                color={menu.color as 'inherit' | 'primary' | 'secondary' | 'default'}
                onClick={() => irPara(menu.route, menu.tooltipTitle)}
              />))}
        </Toolbar>
      </AppBar>
      {/* </Paper> */}
    </>
  );
}


