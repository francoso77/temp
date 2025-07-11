import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME } from './Theme';
import { GlobalContext } from '../../ContextoGlobal/ContextoGlobal';
import { Outlet, useLocation } from 'react-router-dom';
import useUsuarioState from '../../ContextoGlobal/UsuarioState';
import useLayoutState from '../../ContextoGlobal/LayoutState';
import useMensagemState from '../../ContextoGlobal/MensagemState';
import Mensagem from './Mensagem';
import { ROTAS_LIVRES } from './ClsRotas';
import { useEffect, useState } from 'react';
import Condicional from '../../Componentes/Condicional/Condicional';
import HeaderMenu from './HeaderMenu';
import MenuFooter from './MenuFooter';
import styled from 'styled-components';
import Menu from './Menu';
//import Home from '../../Home';
import Login from '../Login/Login';

const VideoBackground = styled('video')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -1,

  // Adiciona responsividade para dispositivos menores
  //'@media (max-width: 768px)': {
  //  objectFit: 'contain', // Ajusta a escala para evitar cortes no vídeo
  //  height: 'auto', // Permite que o vídeo mantenha proporções corretas
  //},
})

function Layout() {

  const [rotaLivre, setRotaLivre] = useState<boolean>(false)
  const { usuarioState, setUsuarioState } = useUsuarioState()
  const { layoutState, setLayoutState } = useLayoutState()
  const { mensagemState, setMensagemState } = useMensagemState()
  const location = useLocation();

  // Verifica se a rota atual é livre
  const chkRotaLivre = () => {
    const urlAtual: string = location.pathname

    const indice: number = ROTAS_LIVRES.findIndex((rsRota) => {
      return urlAtual.includes(rsRota)
    })

    setRotaLivre(indice >= 0)
  }

  useEffect(() => {
    chkRotaLivre()
  }, [location])

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={THEME}>
        <GlobalContext.Provider value={{
          usuarioState: usuarioState,
          setUsuarioState: setUsuarioState,
          layoutState: layoutState,
          setLayoutState: setLayoutState,
          mensagemState: mensagemState,
          setMensagemState: setMensagemState,

        }}>
          <>
            <Mensagem />
            <VideoBackground
              autoPlay
              loop
              muted
              playsInline
              src='./img/fundo.mp4'
            />
            <Condicional condicao={usuarioState.logado}>
              < HeaderMenu />
              <Menu />
            </Condicional>

            <Condicional condicao={(!usuarioState.logado && rotaLivre) || usuarioState.logado}>
              <Outlet />
            </Condicional>

            <Condicional condicao={usuarioState.logado}>
              <MenuFooter />
            </Condicional>

            <Condicional condicao={!usuarioState.logado && !rotaLivre}>
              {/* <Home /> */}
              <Login />

            </Condicional>
          </>
        </GlobalContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default Layout;
