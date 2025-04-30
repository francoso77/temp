import { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Copyright from './Copyright';
import { GlobalContext, GlobalContextInterface } from '../Context/GlobalContext';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export default function Footer() {

    const layoutState = (useContext(GlobalContext) as GlobalContextInterface).layoutState
    return (
        <>
            <Offset />
            <AppBar
                position="fixed"
                color="primary"
                sx={{ top: 'auto', bottom: 0, maxHeigth: 25 }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        {layoutState.aliasDB}
                    </Typography>
                    <Copyright />
                </Toolbar>
            </AppBar>
        </>
    )
}