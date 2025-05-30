import React, { useEffect, useState } from 'react';
import { useContext } from "react";
import { styled } from '@mui/material/styles';
import { Box, Button, Drawer, Toolbar, Typography } from '@mui/material';
import { GlobalContext, GlobalContextInterface } from "../../ContextoGlobal/ContextoGlobal";
import { ColorSelectList } from '../../Componentes/ColorSelect';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ComboBox from '../../Componentes/ComboBox';
import DateRangeSelectorModal from '../../Componentes/DateRangeSelector';
import { AccountInterface } from '../../../../finance-backend/src/interfaces/account';
import { CompanyInterface } from '../../../../finance-backend/src/interfaces/company';
import { CategoryInterface } from '../../../../finance-backend/src/interfaces/category';
import ClsCrud from '../../Utils/ClsCrudApi';
import { TipoTransactionTypes } from '../../types/tipoTransactionTypes';
import { SetorTypes } from '../../types/setorTypes';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const drawerWidth = 270;

export interface DadosPesquisa {
    dataInicio: '',
    dataFim: '',
    categoria: '',
    empresa: '',
    setor: '',
    tipo: '',
}

export default function Menu() {

    const [modalOpen, setModalOpen] = useState(false);
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');
    const [dadosPesquisa, setDadosPesquisa] = useState<Array<DadosPesquisa>>([])

    const [rsContas, setRsContas] = useState<Array<AccountInterface>>([])
    //const [rsEmpresas, setRsEmpresas] = useState<Array<CompanyInterface>>([])
    const [rsCategorias, setRsCategorias] = useState<Array<CategoryInterface>>([])
    const clsCrud = new ClsCrud()

    const handleAbrirModal = () => {
        setModalOpen(true);
    };

    const handleFecharModal = () => {
        setModalOpen(false);
    };

    const handleConfirmarDatas = (inicio: string, fim: string) => {
        setDataInicio(inicio);
        setDataFim(fim);
        //setDadosPesquisa([...dadosPesquisa, { dataInicio: dataInicio, dataFim: fim }])
    };

    const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
    // const [items] = useState<ColorItem[]>([
    //     { id: 1, name: 'Conta Corrente', color: '#ff0000' },
    //     { id: 2, name: 'Caixa', color: '#00ff00' },
    //     { id: 3, name: 'Conta Investimento', color: '#0000ff' },
    // ]);


    const handleItemChange = (selected: AccountInterface | null) => {
        console.log('Selecionado:', selected);
    };

    const xuxu = (selected: CategoryInterface | null) => {
        console.log('Selecionado:', selected);
    };
    const BuscarDados = () => {
        clsCrud
            .pesquisar({
                entidade: "Account",
                campoOrder: ['name'],
            })
            .then((rs: Array<AccountInterface>) => {
                setRsContas(rs)
            })

        clsCrud
            .pesquisar({
                entidade: "Category",
                campoOrder: ['name'],
            })
            .then((rs: Array<CategoryInterface>) => {
                setRsCategorias(rs)
            })

        clsCrud
            .pesquisar({
                entidade: "Account",
                campoOrder: ['name'],
            })
            .then((rs: Array<AccountInterface>) => {
                setRsContas(rs)
            })

    }

    useEffect(() => {
        BuscarDados()
    }, []);

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
                open={layoutState.exibirMenu}
                onClose={() => { setLayoutState({ ...layoutState, exibirMenu: false }) }}
            >
                <Toolbar />
                <Box sx={{ mt: 1, mb: 2, borderTop: '0.5px solid #3a3a3a', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'left' }} >
                    <FilterAltIcon sx={{ color: '#fff', mt: 1 }} />
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: 16, mt: 1 }}>
                        Filtros
                    </Typography>
                </Box>
                <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: 16, mt: 1, ml: 1 }}>
                        Conta
                    </Typography>
                    <ColorSelectList
                        //valorPadrao={rsContas[0].id as string}
                        label="Contas"
                        items={rsContas}
                        onChange={handleItemChange}
                        menuBgColor='#010108'
                        corIcon='#fff'
                        corTexto='#fff'
                    />
                </Box>
                <Box sx={{ ml: 1 }} >
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
                            minWidth: '85%',
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
                            maxWidth: '85%',
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
                <Box sx={{ mt: 2, mr: 5, ml: 1 }}>
                    <ComboBox
                        label='Categoria'
                        corFundo='#010108'
                        corFonte={"#fff"}
                        opcoes={rsCategorias}
                        field='categoria'
                        setState={setDadosPesquisa}
                        dados={dadosPesquisa}
                        campoID='id'
                        campoDescricao='name'
                        mensagemPadraoCampoEmBranco='Escolha uma categoria'
                        onChange={xuxu}
                    />
                </Box>
                <Box sx={{ mt: 2, mr: 5, ml: 1 }}>
                    <ComboBox
                        label='Tipo'
                        corFundo='#010108'
                        corFonte={"#fff"}
                        opcoes={TipoTransactionTypes}
                        field='tipo'
                        setState={setDadosPesquisa}
                        dados={dadosPesquisa}
                        campoID='idTipoTransactionType'
                        campoDescricao='descricao'
                        mensagemPadraoCampoEmBranco='Escolha um tipo'
                        onChange={handleItemChange}

                    />
                </Box>
                <Box sx={{ mt: 2, mr: 5, ml: 1 }}>
                    <ComboBox
                        label='Setor'
                        corFundo='#010108'
                        corFonte={"#fff"}
                        opcoes={SetorTypes}
                        field='setor'
                        setState={setDadosPesquisa}
                        dados={dadosPesquisa}
                        campoID='idSetorType'
                        campoDescricao='descricao'
                        mensagemPadraoCampoEmBranco='Escolha o setor'
                        onChange={handleItemChange}

                    />
                </Box>
                <Offset />
            </Drawer >
        </>
    )
}