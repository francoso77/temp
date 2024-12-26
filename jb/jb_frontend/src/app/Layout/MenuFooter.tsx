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
    usuarioState
  } = React.useContext(GlobalContext) as GlobalContextInterface

  const navigate = useNavigate()
  const irPara = (url: string, titulo: string) => {
    setLayoutState({...layoutState,
      tituloAnterior: layoutState.titulo,
      pathTituloAnterior: layoutState.pathTitulo,
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
      <AppBar onLoad={fecharLoading} position="fixed" color='default' sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          {menuFooter
            .filter((data) => usuarioState.idsMenu.includes(data.id))
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
    </>
  );
}


