import { Collapse, Divider, Icon, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { GlobalContext, GlobalContextInterface } from "../../ContextoGlobal/ContextoGlobal";
import { MenuOpcoesInterface } from './ClsMenu';


interface PropsInterface {
  menu: MenuOpcoesInterface,
  deslocamento: number
}


export default function MenuItem({ menu, deslocamento }: PropsInterface) {

  const navigate = useNavigate()

  const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface

  const [openSubMenu, setOpenSubMenu] = useState(false)

  const handleClickSubMenu = (oque: any) => {
    setOpenSubMenu(!openSubMenu)
  }

  const irPara = (url: string, titulo: string) => {
    navigate(url)
    setLayoutState({ ...layoutState, exibirMenu: false, titulo: titulo })
  }

  if (menu.filhos.length === 0) {
    return (
      <ListItemButton onClick={() => irPara(menu.path, menu.descricao)}>
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