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
import { CategoryInterface } from '../../../../finance-backend/src/interfaces/category';
import ClsCrud from '../../Utils/ClsCrudApi';
import { TipoTransactionType, TipoTransactionTypes } from '../../types/tipoTransactionTypes';
import { SetorType, SetorTypes } from '../../types/setorTypes';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

const drawerWidth = 270;

export interface DadosPesquisa {
    dataInicio: string;
    dataFim: string;
    categoria: string;
    conta: string;
    setor: string;
    tipo: string
}

export default function Menu() {

    const { layoutState, setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
    const dadosIniciais: DadosPesquisa = { dataInicio: '', dataFim: '', categoria: '', conta: layoutState.contaPadrao ?? '', setor: '', tipo: '' }
    const [modalOpen, setModalOpen] = useState(false);
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');
    const [dadosPesquisa, setDadosPesquisa] = useState<DadosPesquisa>(dadosIniciais)
    const [rsContas, setRsContas] = useState<Array<AccountInterface>>([])
    const [rsCategorias, setRsCategorias] = useState<Array<CategoryInterface>>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [contaPadrao, setContaPadrao] = useState<string | null>(null)
    const clsCrud = new ClsCrud()

    const handleAbrirModal = () => {
        setModalOpen(true);
    };

    const handleFecharModal = () => {
        setModalOpen(false);
    };

    const updateLayoutState = <K extends keyof typeof layoutState>(
        key: K,
        value: (typeof layoutState)[K]
    ) => {
        if (key === 'contaPadrao') {
            setLayoutState(prev => ({
                ...prev,
                contaPadrao: value as string | null,
                dataInicio: null,
                dataFim: null,
                accountId: null,
                categoryId: null,
                type: null,
                setor: null,
            }));
        } else {
            setLayoutState(prev => ({ ...prev, [key]: value }));
        }
    };


    const handleConfirmarDatas = (inicio: string, fim: string) => {
        setDataInicio(inicio);
        setDataFim(fim);
        updateLayoutState("dataInicio", inicio);
        updateLayoutState("dataFim", fim);
        setDadosPesquisa({ ...dadosPesquisa, dataInicio: inicio ?? "", dataFim: fim ?? "" })
    };

    const handleItemChangeAccount = (selected: AccountInterface | null) => {
        updateLayoutState("contaPadrao", selected?.id ?? null);
        setContaPadrao(selected?.id ?? null);
        setDadosPesquisa({ ...dadosPesquisa, conta: selected?.id ?? "" })
    };

    const handleItemChangeCategory = (selected: CategoryInterface | null) => {
        updateLayoutState("categoryId", selected?.id ?? null);
        setDadosPesquisa({ ...dadosPesquisa, categoria: selected?.id ?? "" })
    };

    const handleItemChangeSetor = (selected: "Dublagem" | "Malharia" | null) => {
        updateLayoutState("setor", selected);
        setDadosPesquisa({ ...dadosPesquisa, setor: selected ?? "" })
    };

    const handleItemChangeTipo = (selected: "Receita" | "Despesa" | null) => {
        updateLayoutState("type", selected);
        setDadosPesquisa({ ...dadosPesquisa, tipo: selected ?? "" })
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

        clsCrud
            .pesquisar({
                entidade: "Account",
                criterio: { isDefault: true },
                select: ['id'],
            })
            .then((rs: any) => {
                if (rs.length > 0) {
                    setContaPadrao(rs[0].id as string || String(rs[0].id))
                }
            })

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        BuscarDados()
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
    }, [dadosPesquisa]);

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
                        label="Contas"
                        items={rsContas}
                        onChange={handleItemChangeAccount}
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
                        onChange={handleItemChangeCategory}
                        valorPadraoCampoEmBranco={SetorType.Malharia}
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
                        onChange={handleItemChangeTipo}
                        valorPadraoCampoEmBranco={TipoTransactionType.Receita}
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
                        onChange={handleItemChangeSetor}
                        valorPadraoCampoEmBranco={SetorType.Malharia}
                    />
                </Box>
                <Offset />
            </Drawer >
        </>
    )
}