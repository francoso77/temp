import { Collapse, Divider, Icon, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { GlobalContext, GlobalContextInterface } from "../../ContextoGlobal/ContextoGlobal";
import { MenuOpcoesInterface } from './ClsMenu';
import ClsApi from '../../Utils/ClsApi';
import { RespostaPadraoInterface } from '../../Interfaces/respostaPadrao.interface';
import { LoginInterface } from '../../Interfaces/loginIterface';
import { UsuarioType } from '../../types/usuarioTypes';
import { PermissoesTypes } from '../../types/permissoesTypes';


interface PropsInterface {
  menu: MenuOpcoesInterface,
  deslocamento: number
}


export default function MenuItem({ menu, deslocamento }: PropsInterface) {

  const navigate = useNavigate()
  const clsApi: ClsApi = new ClsApi()
  const { layoutState, setLayoutState, usuarioState, setUsuarioState } = useContext(GlobalContext) as GlobalContextInterface
  const [openSubMenu, setOpenSubMenu] = useState(false)

  const handleClickSubMenu = (oque: any) => {
    setOpenSubMenu(!openSubMenu)
  }

  const irPara = (url: string, titulo: string) => {
    navigate(url)
    setLayoutState({ ...layoutState, exibirMenu: false, titulo: titulo })
  }

  const handleLogout = async () => {

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

  if (menu.filhos.length === 0) {
    return (
      <ListItemButton onClick={() => menu.descricao === 'Sair' ? handleLogout() : irPara(menu.path, menu.descricao)}>
        <ListItemIcon>
          <Icon sx={{ textAlign: 'center', marginLeft: deslocamento }}>{menu.icon}</Icon>
        </ListItemIcon>
        <ListItemText sx={{ marginLeft: deslocamento - 2 }} primary={menu.descricao} />
      </ListItemButton>
    )
  } else {
    return (
      <>
        <ListItemButton onClick={handleClickSubMenu}>
          <ListItemIcon >
            <Icon sx={{ marginLeft: deslocamento }}>{menu.icon}</Icon>
          </ListItemIcon>
          <ListItemText sx={{ marginLeft: deslocamento - 2 }} primary={menu.descricao} />
          {openSubMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        {
          menu.filhos.map((menu, index) =>

            <Collapse in={openSubMenu} timeout="auto" unmountOnExit key={index}>
              <List component="div" disablePadding>
                <MenuItem menu={menu} deslocamento={deslocamento + 2} />
              </List>
            </Collapse>

          )}
        <Divider />
      </>
    )
  }
}