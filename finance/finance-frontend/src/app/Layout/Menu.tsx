import React, { useState } from 'react';
import { useContext } from "react";
import { styled } from '@mui/material/styles';
import { Box, Button, Drawer, List, Toolbar, Typography } from '@mui/material';
import MenuItem from './MenuItem';
import { GlobalContext, GlobalContextInterface } from "../../ContextoGlobal/ContextoGlobal";
import { MenuOpcoesInterface } from "./ClsMenu";
import { ColorItem, ColorSelectList } from '../../Componentes/ColorSelect';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ComboBox from '../../Componentes/ComboBox';
import DateRangeSelectorModal from '../../Componentes/DateRangeSelector';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const drawerWidth = 260


interface CategoriaInterface {
    id: number;
    name: string;
}

export default function Menu() {

    const [modalOpen, setModalOpen] = useState(false);
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');

    const handleAbrirModal = () => {
        setModalOpen(true);
    };

    const handleFecharModal = () => {
        setModalOpen(false);
    };

    const handleConfirmarDatas = (inicio: string, fim: string) => {
        setDataInicio(inicio);
        setDataFim(fim);
    };

    const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
    const [items, setItems] = useState<ColorItem[]>([
        { id: 1, name: 'Conta Corrente', color: '#ff0000' },
        { id: 2, name: 'Caixa', color: '#00ff00' },
        { id: 3, name: 'Conta Investimento', color: '#0000ff' },
    ]);

    const [categorias, setCategorias] = useState<CategoriaInterface[]>([
        { id: 1, name: 'Vendas' },
        { id: 2, name: 'Serviços' },
        { id: 3, name: 'Salários' },
    ]);

    const [tipos, setTipos] = useState<CategoriaInterface[]>([
        { id: 2, name: 'Despesas' },
        { id: 3, name: 'Receitas' },
    ])


    const [setores, setSetores] = useState<CategoriaInterface[]>([
        { id: 2, name: 'Dublagem' },
        { id: 3, name: 'Malharia' },
    ])
    const handleItemChange = (selected: ColorItem | null) => {
        console.log('Selecionado:', selected);
    };

    return (
        <>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        borderRight: '1px solid #3a3a3a',
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        marginBottom: -100,
                        bgcolor: '#010108',
                        color: 'white'
                    }, zIndex: (theme) => theme.zIndex.appBar - 1
                }}
                anchor='left'
                open={true}
            //onClose={() => { setLayoutState({ ...layoutState, exibirMenu: false }) }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List
                        sx={{ width: '100%', maxWidth: 200, }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        {layoutState.opcoesMenu?.map((menu: MenuOpcoesInterface, indice: number) =>
                            <MenuItem key={indice} menu={menu} deslocamento={0} />
                        )}
                    </List>
                    {/* <Offset /> */}
                </Box>
                <Box sx={{ mb: 2, borderTop: '0.5px solid #3a3a3a', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }} >
                    <FilterAltIcon sx={{ color: '#fff', mt: 1 }} />
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: 16, mt: 1 }}>
                        Filtros
                    </Typography>
                </Box>
                <Box >
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: 16, mt: 1, ml: 1 }}>
                        Conta
                    </Typography>
                    <ColorSelectList
                        valorPadrao={items[0].id as number}
                        label="Contas"
                        items={items}
                        onChange={handleItemChange}
                        menuBgColor='#010108'
                        corIcon='#fff'
                        corTexto='#fff'
                    />
                </Box>
                <Box >
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: 16, mt: 1, ml: 1 }}>
                        Período
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAbrirModal}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#010108',
                            color: '#fff',
                            border: '1px solid #3a3a3a',
                            fontSize: '16px',
                            minWidth: '95%',
                            m: 0,
                            p: 0.5
                        }}
                    >
                        Selecionar Intervalo
                    </Button>
                    <Box
                        sx={{
                            mt: 1,
                            p: 1,
                            backgroundColor: '#030313',
                            color: '#fff',
                            border: '1px solid #3a3a3a',
                            maxWidth: '95%',
                            justifyItems: 'center'
                        }}>
                        <Typography variant="subtitle1" >Período Selecionado:</Typography>
                        <Typography sx={{ fontSize: 14 }} variant="body2">De: {dataInicio || '---'} a {dataFim || '---'}</Typography>
                    </Box>
                    <DateRangeSelectorModal
                        open={modalOpen}
                        onClose={handleFecharModal}
                        onConfirm={handleConfirmarDatas}
                    />

                </Box>
                <Box >
                    <ComboBox
                        label='Categoria'
                        corFundo='#010108'
                        opcoes={categorias}
                        onChange={(e) => console.log(e)}
                        field='name'
                        setState={() => { }}
                        dados={{}}
                        campoID='id'
                        campoDescricao='name'
                        mensagemPadraoCampoEmBranco='Escolha uma categoria'
                    />
                </Box>
                <Box sx={{ mt: 5 }}>
                    <ComboBox
                        label='Tipo'
                        corFundo='#010108'
                        opcoes={tipos}
                        onChange={(e) => console.log(e)}
                        field='name'
                        setState={() => { }}
                        dados={{}}
                        campoID='id'
                        campoDescricao='name'
                        mensagemPadraoCampoEmBranco='Escolha um tipo'
                    />
                </Box>
                <Box sx={{ mt: 5 }}>
                    <ComboBox
                        label='Setor'
                        corFundo='#010108'
                        opcoes={setores}
                        onChange={(e) => console.log(e)}
                        field='name'
                        setState={() => { }}
                        dados={{}}
                        campoID='id'
                        campoDescricao='name'
                        mensagemPadraoCampoEmBranco='Escolha um setor'
                    />
                </Box>
            </Drawer>
        </>
    )
}