import { useContext } from "react";
import { styled } from '@mui/material/styles';
import { Box, Drawer, List, Toolbar } from '@mui/material';
import { EstruturaMenuInterface } from "./MenuCls";
import MenuItem from './MenuItem';
import { GlobalContext, GlobalContextInterface } from '../Context/GlobalContext';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const drawerWidth = 350

export default function Menu() {

    const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface

    return (
        <>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', marginBottom: -100 }, zIndex: (theme) => theme.zIndex.appBar - 1
                }}
                anchor='left'
                open={layoutState.exibirMenu}
                onClose={() => { setLayoutState({ ...layoutState, exibirMenu: false }) }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        {layoutState.opcoesMenu.map((menu: EstruturaMenuInterface, indice: number) =>
                            <MenuItem key={indice} menu={menu} deslocamento={0} />
                        )}
                    </List>
                    <Offset />
                </Box>
            </Drawer>
        </>
    )
}