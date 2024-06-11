import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { GlobalContext, GlobalContextInterface } from '../Context/GlobalContext';
import Condicional from '../Components/Condicional/Condicional';
import { MensagemTipo } from '../Context/MensagemState';

export default function Loading() {

    const { mensagemState } = React.useContext(GlobalContext) as GlobalContextInterface
    return (
        <Condicional condicao={mensagemState.tipo === MensagemTipo.Loading}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ height: 40 }}>
                    <CircularProgress />
                </Box>
            </Box>
        </Condicional>
    );
}