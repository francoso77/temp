import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
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
import Menu from './Menu';
import { Welcome } from './Welcome';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    chkRotaLivre()
  }, [location])

  return (
    <>
      <ThemeProvider theme={THEME}>
        <CssBaseline />
        <GlobalStyles styles={{
          body: {
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            background: '#010108',
            // backgroundImage: 'linear-gradient(135deg, #09072e 0%, #0c0a3e 50%, #1a184b 100%)',
            // backgroundRepeat: 'no-repeat',
            // backgroundAttachment: 'fixed',
            // backgroundSize: 'cover',
            color: '#fff',
            fontFamily: 'Roboto, Open Sans, sans-serif',
          }
        }} />
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
              <Welcome />

            </Condicional>
          </>
        </GlobalContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default Layout;
