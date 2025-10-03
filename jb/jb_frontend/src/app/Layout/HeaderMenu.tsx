import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { Badge, Checkbox, ListItemText, Menu, MenuItem, Paper, Tooltip, Typography } from '@mui/material';
import Condicional from '../../Componentes/Condicional/Condicional';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { UsuarioType } from '../../types/usuarioTypes';
import { PermissoesTypes } from '../../types/permissoesTypes';
import { RespostaPadraoInterface } from '../../Interfaces/respostaPadrao.interface';
import { LoginInterface } from '../../Interfaces/loginIterface';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ClsApi from '../../Utils/ClsApi';
import { NotificationInterface } from '../../Interfaces/sistema/notificationInterface';
import CommentIcon from '@mui/icons-material/Comment';

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);

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

  const unreadCount = notifications.filter(n => !n.read).length;

  const verificarNotifications = async () => {

    const not = await clsApi.execute<NotificationInterface[]>({
      method: 'get',
      url: 'notifications/' + `${usuarioState.idUsuario}`,
      token: usuarioState.token
    })
    if (not) {
      setNotifications(not)
    }
  }

  const handleReadMsg = async (id: number) => {

    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n))

    await clsApi.execute<NotificationInterface[]>({
      method: 'patch',
      url: 'notifications/' + `${id}` + '/read',
      token: usuarioState.token
    })
  }

  React.useEffect(() => {
    verificarTipoUsuario()
  }, [])

  React.useEffect(() => {
    // executa logo de cara
    verificarNotifications();

    // cria o intervalo (ex: 30s)
    const interval = setInterval(() => {
      verificarNotifications();
    }, 30000);

    // limpa intervalo quando desmontar o componente
    return () => clearInterval(interval);
  }, [usuarioState.idUsuario, usuarioState.token]); // refaz se trocar usuário/token

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
            <Box sx={{ marginRight: 2 }}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
                {
                  notifications.map((n) => (
                    <Paper sx={{ my: 0.5, }} >
                      <MenuItem
                        key={n.id}
                        sx={{ bgcolor: n.read ? '#dfdcdc' : n.color, color: n.read ? 'gray' : 'black' }}
                      >
                        <IconButton aria-label="comment">
                          <CommentIcon sx={{ color: n.read ? 'gray' : 'black' }} />
                        </IconButton>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontWeight: 'bold' }}>
                              {n.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'pre-line' }}>
                              {n.message}
                            </Typography>
                          }
                        />
                        <Checkbox
                          sx={{ ml: 2 }}
                          edge="start"
                          checked={n.read}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': 'teste' }}
                          onClick={() => handleReadMsg(n.id)}
                        />
                      </MenuItem>
                    </Paper>
                  ))
                }
              </Menu>
            </Box>
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
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
                  {
                    notifications.map((n) => (
                      <MenuItem
                        key={n.id}
                        sx={{ bgcolor: n.read ? '#dfdcdc' : n.color, color: n.read ? 'gray' : 'black' }}
                      >
                        <IconButton aria-label="comment">
                          <CommentIcon sx={{ color: n.read ? 'gray' : 'black' }} />
                        </IconButton>
                        <ListItemText
                          primary={n.title}
                          secondary={
                            <Typography variant="subtitle1" sx={{ whiteSpace: 'pre-line' }}>
                              {n.message}
                            </Typography>
                          }
                        />
                        <Checkbox
                          sx={{ ml: 2 }}
                          edge="start"
                          checked={n.read}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': 'teste' }}
                        />
                      </MenuItem>
                    ))
                  }
                </Menu>
              </Box>
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
