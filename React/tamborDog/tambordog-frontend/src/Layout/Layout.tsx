import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME } from './Theme';
import { GlobalContext } from '../ContextoGlobal/ContextoGlobal';
import { Outlet } from 'react-router-dom';
import useUsuarioState from '../ContextoGlobal/UsuarioState';
import useLayoutState from '../ContextoGlobal/LayoutState';
import MenuNav from './MenuNav';
import Header from './Header';
import useMensagemState from '../ContextoGlobal/MensagemState';
import Mensagem from './Mensagem';
import { ROTAS_LIVRES } from './ClsRotas';
import { useEffect, useState } from 'react';
import Condicional from '../Componentes/Condicional/Condicional';
import EventosEmAberto from '../Views/Eventos/EventosEmAberto';

function Layout() {

  const [rotaLivre, setRotaLivre] = useState<boolean>(false)
  const { usuarioState, setUsuarioState } = useUsuarioState()
  const { layoutState, setLayoutState } = useLayoutState()
  const { mensagemState, setMensagemState } = useMensagemState()

  const chkRotaLivre = () => {
    const urlAtual: string = window.location.href

    const indice: number = ROTAS_LIVRES.findIndex((rsRota) => {
      return urlAtual.includes(rsRota)
    })

    setRotaLivre(indice >= 0)
  }

  useEffect(() => {
    chkRotaLivre()
  })

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
            <Condicional condicao={usuarioState.logado}>
              <Header />
            </Condicional>

            <Condicional
              condicao={
                (!usuarioState.logado && rotaLivre) || usuarioState.logado
              }
            >
              <Outlet />
            </Condicional>

            <Condicional condicao={usuarioState.logado}>
              <MenuNav />
            </Condicional>

            <Condicional condicao={!usuarioState.logado && !rotaLivre}>
              <EventosEmAberto />
            </Condicional>
          </>
        </GlobalContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default Layout;
