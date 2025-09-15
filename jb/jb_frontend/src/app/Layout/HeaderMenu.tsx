import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Tooltip, Typography } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { UsuarioType } from '../../types/usuarioTypes';
import { PermissoesTypes } from '../../types/permissoesTypes';
import { RespostaPadraoInterface } from '../../Interfaces/respostaPadrao.interface';
import { LoginInterface } from '../../Interfaces/loginIterface';
import ClsApi from '../../Utils/ClsApi';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function HeaderMenu() {

  const {
    layoutState,
    setLayoutState,
    mensagemState,
    setMensagemState,
    usuarioState,
    setUsuarioState
  } = React.useContext(GlobalContext) as GlobalContextInterface

  const navigate = useNavigate()

  const clsApi: ClsApi = new ClsApi()
  const irPara = (url: string, titulo: string) => {
    navigate(url)
    setLayoutState({ ...layoutState, exibirMenu: false, titulo: titulo })
  }
  const toggleDrawer = () => {
    setLayoutState({ ...layoutState, exibirMenu: !layoutState.exibirMenu })
  };

  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  const handleClick = async () => {

    const Logout = await clsApi.execute<RespostaPadraoInterface<LoginInterface>>({
      method: 'post',
      url: 'logoutUsuario',
      token: usuarioState.token,
      cpf: usuarioState.cpfUsuario
    })

    if (Logout.ok) {

      localStorage.clear()

      setUsuarioState({
        idUsuario: 0,
        nomeUsuario: '',
        logado: false,
        cpfUsuario: '',
        token: '',
        tipoUsuario: UsuarioType.default,
        //idsMenu: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        idsMenu: [6, 10],
        permissoes: PermissoesTypes,
        idVendedor: 0
      })

      irPara('/', '')
    }
  }

  const verificarTipoUsuario = () => {
    // o tipo de usuário determina se terá menu ou não 
    let tipoUsuario: any = usuarioState.tipoUsuario
    const estoquistaMalharia: number = UsuarioType.estoquistaMalharia
    const admin: number = UsuarioType.admin
    const estoquistaDublagem: number = UsuarioType.estoquistaDublagem
    tipoUsuario = Number(tipoUsuario)
    return tipoUsuario === admin || tipoUsuario === estoquistaMalharia || tipoUsuario === estoquistaDublagem
  }

  React.useEffect(() => {
    verificarTipoUsuario()
  }, [])

  return (
    <>
      <Condicional condicao={verificarTipoUsuario()}>
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
      </Condicional>
      <Condicional condicao={!verificarTipoUsuario()}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar onLoad={fecharLoading} color='primary' >
            <Toolbar>
              <Box>
                <img src="img/logomarca.png" width={55} alt="logo tipo da empresa JB Textl" />
              </Box>
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
                    onClick={() => handleClick()}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>
          <Offset />
        </Box>

      </Condicional>
    </>
  );
}
