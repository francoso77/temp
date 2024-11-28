import { CssBaseline, ThemeProvider } from '@mui/material';
import { THEME } from './Theme';
import { GlobalContext } from '../../ContextoGlobal/ContextoGlobal';
import { Outlet } from 'react-router-dom';
import useUsuarioState from '../../ContextoGlobal/UsuarioState';
import useLayoutState from '../../ContextoGlobal/LayoutState';
//import Header from './Header';
import useMensagemState from '../../ContextoGlobal/MensagemState';
import Mensagem from './Mensagem';
import { ROTAS_LIVRES } from './ClsRotas';
import { useEffect, useState } from 'react';
import Condicional from '../../Componentes/Condicional/Condicional';
import HeaderMenu from './HeaderMenu';
import MenuFooter from './MenuFooter';
import Login from '../Login/Login';

function Layout() {

  const [rotaLivre, setRotaLivre] = useState<boolean>(false)
  const { usuarioState, setUsuarioState } = useUsuarioState()
  const { layoutState, setLayoutState } = useLayoutState()
  const { mensagemState, setMensagemState } = useMensagemState()

  // Verifica se a rota atual é livre
  const chkRotaLivre = () => {
    const urlAtual: string = window.location.href

    const indice: number = ROTAS_LIVRES.findIndex((rsRota) => {
      return urlAtual.includes(rsRota)
    })

    setRotaLivre(indice >= 0)
  }

  useEffect(() => {
    chkRotaLivre()
  }, [window.location.href])

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
              {/* <Header /> */}
              < HeaderMenu />
            </Condicional>

            <Condicional
              condicao={
                (!usuarioState.logado && rotaLivre) || usuarioState.logado
              }
            >
              <Outlet />
            </Condicional>

            <Condicional condicao={usuarioState.logado}>
              <MenuFooter />
            </Condicional>

            <Condicional condicao={!usuarioState.logado && !rotaLivre}>
              <Login />
            </Condicional>
          </>
        </GlobalContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default Layout;
