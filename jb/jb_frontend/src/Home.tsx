import React, { useEffect, useState } from "react"
import { AppBar, Box, Button, CardMedia, Container, Grid, Menu, MenuItem, Paper, ThemeProvider, Toolbar, Typography } from "@mui/material"
import ClsApi from './Utils/ClsApi'
import useUsuarioState from './ContextoGlobal/UsuarioState'
import useMensagemState from './ContextoGlobal/MensagemState'
import useLayoutState from './ContextoGlobal/LayoutState'
import { GlobalContextInterface } from './ContextoGlobal/ContextoGlobal'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'


export default function Home() {

  const { usuarioState, setUsuarioState } = useUsuarioState()

  const { mensagemState, setMensagemState } = useMensagemState()

  const { layoutState, setLayoutState } = useLayoutState()

  const [rotaLivre, setRotaLivre] = useState<boolean>(false)

  const clsApi = new ClsApi()

  const ContextoGlobalDefault: GlobalContextInterface = {
    setUsuarioState: setUsuarioState,
    usuarioState: usuarioState,
    layoutState: layoutState,
    setLayoutState: setLayoutState,
    mensagemState: mensagemState,
    setMensagemState: setMensagemState,
  }

  const Offset = styled("div")(({ theme }) => theme.mixins.toolbar)

  const pesquisarEventos = () => {

    // clsBackEnd.execute<Array<ProvaInterface>>({ url: 'provasEmAberto', metodo: 'get' }).then((rs) => {
    //   setRsProvas(rs)
    // })

  }

  useEffect(() => {
    pesquisarEventos()
  }, [])

  const nav = useNavigate()

  const irPara = (url: string) => {
    nav(url)
  }

  return (
    <>

      <Box sx={{
        backgroundColor: '#F7BA0B',
        position: 'absolute',
        height: '418px',
        width: '100%',
        margin: 0,
        top: 0,
        left: 0,
        zIndex: -1
      }}>
      </Box>

      <AppBar position="static" sx={{ backgroundColor: '#3b4869' }}>

        <Container maxWidth="xl">
          <Toolbar disableGutters>

            <img src="/img/logomarca.png" alt="Logo JB Têxtil" style={{ width: '70px' }} />

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button
                key='btCadastrar'
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => irPara('/user/CadastroUsuario')}
              >
                Cadastrar
              </Button>

              <Button
                key='btEntrar'
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={() => irPara('/user/LoginApp')}
              >
                Entrar
              </Button>
            </Box>

          </Toolbar>


        </Container>
      </AppBar>

      <Grid container justifyContent='center' alignItems='center'>

        <Grid item xs={12} sm={6}>

          <Typography
            component="p"
            sx={{
              mt: 5,
              textAlign: 'center',
              // display: { xs: 'flex' },
              flexGrow: 1,
              fontFamily: 'roboto',
              fontSize: { xs: '24pt', md: '36pt' },
              fontWeight: 600,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            BEM VINDO <br /> A <br />JB TÊXTIL
          </Typography>

          <CardMedia
            src="https://www.youtube.com/embed/Ptbk2af68e8"
            //src="./video/institucional.mp4"
            component="video"
            sx={{ width: '100%', marginTop: '15px', border: '1px solid black' }}

            autoPlay
            loop
            controls
            muted
          />

          <Typography
            component="p"
            sx={{
              mt: 5,
              textAlign: 'center',
              // display: { xs: 'flex' },
              flexGrow: 1,
              fontFamily: 'roboto',
              fontSize: { xs: '24pt', md: '36pt' },
              fontWeight: 600,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            Próximas Provas
          </Typography>

          {/* {rsProvas.map((prova, indice) =>
            <CardEvento
              key={indice}
              cidade={prova.cidade}
              data={prova.dataHoraProva}
              imagem="./imagens/logo.png"
              qtdInscritos={0}
              titulo={prova.nomeProva}
              uf={prova.uf}
            />
          )} */}

        </Grid>

      </Grid>

    </>
  )
}