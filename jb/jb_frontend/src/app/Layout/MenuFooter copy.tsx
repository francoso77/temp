import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@mui/material';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
// import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import FactoryIcon from '@mui/icons-material/Factory';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import menuCrud from '../../Utils/menuCrud.json';

// const settingsJSON = [
//   {
//     "id": 1,
//     "menu": "Atletas",
//     "icon": "person_outline_outlined",
//     "path": "/Atleta",
//     "titulo": "Atletas",
//   },
//   {
//     "id": 2,
//     "menu": "Cães",
//     "icon": "pets",
//     "path": "/Cao",
//     "titulo": "Cães",
//   },
//   {
//     "id": 3,
//     "menu": "Calendário",
//     "icon": "calendar_month",
//     "path": "/EventosEmAberto",
//     "titulo": "Eventos Em Aberto",
//   },
//   {
//     "id": 4,
//     "menu": "Etapas Realizadas",
//     "icon": "military_tech",
//     "path": "/EtapasRealizadas",
//     "titulo": "Etapas Realizadas",
//   },
//   {
//     "id": 5,
//     "menu": "Raças",
//     "icon": "military_tech",
//     "path": "/Raca",
//     "titulo": "Raças",
//   },
//   {
//     "id": 6,
//     "menu": "Categorias",
//     "icon": "military_tech",
//     "path": "/Categoria",
//     "titulo": "Categorias",
//   },
//   {
//     "id": 7,
//     "menu": "Campeonatos",
//     "icon": "military_tech",
//     "path": "/Campeonato",
//     "titulo": "Campeonatos",
//   },
//   {
//     "id": 8,
//     "menu": "Provas",
//     "icon": "military_tech",
//     "path": "/Prova",
//     "titulo": "Provas",
//   },
// ]
const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
  color: 'white',
});

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function MenuFooter_copy() {

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const { mensagemState, setMensagemState } = React.useContext(GlobalContext) as GlobalContextInterface
  const { layoutState, setLayoutState } = React.useContext(GlobalContext) as GlobalContextInterface


  const navigate = useNavigate()

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  const irPara = (url: string, titulo: string) => {
    setLayoutState({
      tituloAnterior: layoutState.titulo,
      pathTituloAnterior: layoutState.pathTitulo,
      titulo: titulo,
      pathTitulo: url
    })
    navigate(url)
    setAnchorElUser(null);
  }

  const fecharLoading = () => {
    setMensagemState({ ...mensagemState, exibir: false })
  }

  return (
    <React.Fragment>
      <Offset />
      <AppBar onLoad={fecharLoading} position="fixed" color='default' sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Tooltip title={'Pedidos'}>
            <IconButton color="primary" aria-label="Dashboard" id="Dashboard" onClick={() => irPara('/Pedido', 'Pedidos')}>
              {/* <MilitaryTechOutlinedIcon sx={{ width: 32, height: 32 }} /> */}
              <NoteAltOutlinedIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 0.25 }} />
          <Tooltip title={'Entradas'}>
            <IconButton color="primary" onClick={() => irPara('/Entrada', 'Entradas de Produtos')}>
              <AddShoppingCartOutlinedIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
          {/* <StyledFab color="primary" aria-label="add">
            <Tooltip title="Cadastros Gerais" onClick={handleOpenUserMenu} sx={{ p: 0 }} >
              <AddIcon />
            </Tooltip>
          </StyledFab>
          <Menu
            sx={{ mt: '-55px', ml: '25px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {menuCrud.map((setting) => (
              <MenuItem key={setting.id} onClick={() => irPara(setting.path, setting.titulo)}>
                <Icon sx={{ textAlign: 'center', marginRight: 1 }}>{setting.icon}</Icon>
                <Typography textAlign="center">{setting.menu}</Typography>
              </MenuItem>
            ))}
          </Menu> */}
          <Box sx={{ flexGrow: 0.5 }} />
          <Tooltip title={'Produção Malharia'}>
            <IconButton color="primary" onClick={() => irPara('/ProducaoMalharia', 'Produção Malharia')}>
              <FactoryIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 0.25 }} />
          <Tooltip title={'Tinturaria'}>
            <IconButton color="primary" onClick={() => irPara('/Tinturaria', 'Tinturaria')}>
              <ColorLensTwoToneIcon sx={{ width: 32, height: 32 }} />
            </IconButton>
            {/* <IconButton color="primary" onClick={() => irPara('/Atleta', 'Atleta')}>
            <Avatar
              alt="Foto do Usuário"
              src="imagens/avatar.jpg"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton> */}
          </Tooltip>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
