import React, { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TableFooter, Button, Typography } from '@mui/material';
import ClsApi from "../../Utils/ClsApi";
import ClsCrud from "../../Utils/ClsCrudApi";
import ClsFormatacao from "../../Utils/ClsFormatacao";
import { PrazoEntregaInterface } from '../../../../jb_backend/src/interfaces/prazoEntregaInterface';
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface';
import { PedidoInterface } from '../../../../jb_backend/src/interfaces/pedidoInterface';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import Condicional from '../../Componentes/Condicional/Condicional';
// import './printStyles.css';

type Order = 'asc' | 'desc'

interface PaginaDataTableCabecalhoInterface {
    campo: string
    cabecalho: string
    alinhamento?: 'left' | 'right' | 'center'
    largura?: number
    format?: (arg: any, row: any) => string | number | undefined
}

interface PaginaDataTableInterface {
    dados: Array<any>
    cabecalho: Array<PaginaDataTableCabecalhoInterface>
    // cabecalhoDetalhe?: Array<any>
    // acoes?: Array<DataTableAcaoInterface<any>>
    // acoesDetalhe?: Array<DataTableAcaoInterface<any>>
    // onStatus?: (selecao: any, setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>) => void
    // onSelecionarLinha?: (
    //   rs: { [key: string]: number | string } | Object,
    //   linha: number
    // ) => void
    // exibirPaginacao?: boolean
    // temTotal?: boolean;
    colunaSoma?: Array<string>
    // qtdColunas?: number;
}
export default function RelacaoProgramcao() {
    const clsApi = new ClsApi();
    const clsCrud = new ClsCrud();
    const clsFormatacao = new ClsFormatacao();

    const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
    const [dadosFilter, setDadosFilter] = React.useState<any[]>([])
    const [dados, setDados] = React.useState<any[]>([])
    const [rsPrazo, setRsPrazo] = useState<Array<PrazoEntregaInterface>>([])
    const [rsCliente, setRsCliente] = useState<Array<PessoaInterface>>([])
    const [rsVendedor, setRsVendedor] = useState<Array<PessoaInterface>>([])
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof any>('nome')


    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof any,
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
    }

    function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator<Key extends keyof any>(
        order: Order,
        orderBy: Key,
    ): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    const sumColumns = (data: Array<any>, columns: Array<string>): Record<string, number> => {
        return columns.reduce((result, column) => {
            result[column] = data.reduce((sum, row) => sum + row[column], 0);
            return result;
        }, {} as Record<string, number>);
    };

    // const totalColunas = sumColumns(dados, colunaSoma)

    const cabecalhoTabela: Array<PaginaDataTableCabecalhoInterface> = [
        {
            cabecalho: 'Metros',
            alinhamento: 'right',
            campo: 'qtdTotalEspuma',
            format: (qtd) => clsFormatacao.currency(qtd)
        },
        {
            cabecalho: 'Espuma',
            alinhamento: 'center',
            campo: 'materiaPrima',
            largura: 15,
            // format: (v) => clsFormatacao.numeroPadrao(v)
        },
        {
            cabecalho: 'Cor',
            alinhamento: 'center',
            campo: 'cor',
            // format: (data) => clsFormatacao.dataISOtoUser(data)
        },

        // {
        //     cabecalho: 'Cliente',
        //     alinhamento: 'left',
        //     campo: 'nomeCliente'
        //     // campo: 'idPessoa_cliente',
        //     // format: (_v, rs: any) => rs.cliente.nome
        // },
        // {
        //     cabecalho: 'Vendedor',
        //     alinhamento: 'left',
        //     campo: 'nomeVendedor'
        //     // campo: 'idPessoa_vendedor',
        //     // format: (_v, rs: any) => rs.vendedor.nome
        // },
    ]
    const cabecalhoTabelaDetalhes: Array<PaginaDataTableCabecalhoInterface> = [
        {
            cabecalho: 'Metros',
            alinhamento: 'right',
            campo: 'metros',
            format: (qtd) => clsFormatacao.currency(qtd)
        },
        {
            cabecalho: 'tecido',
            alinhamento: 'center',
            campo: 'tecido',
            // format: (v) => clsFormatacao.numeroPadrao(v)
        },
        {
            cabecalho: 'Cor',
            alinhamento: 'center',
            campo: 'cor',
            // format: (data) => clsFormatacao.dataISOtoUser(data)
        },

    ]
    // const BuscarDados = () => {
    //     clsCrud.pesquisar({
    //         entidade: 'Pedido',
    //         relations: [
    //             'detalhePedidos',
    //             'detalhePedidos.produto',
    //             'detalhePedidos.produto.estrutura'
    //         ],
    //        })
    //         .then((rs: Array<any>) => {
    //             setDados(rs)
    //             console.log('resultado do rs:', rs)
    //         })
    // }

    const BuscarDados = () => {
        // clsCrud.pesquisar({
        //     entidade: 'Pedido',
        //     relations: [
        //         'detalhePedidos',
        //         'detalhePedidos.produto',
        //     ],
        // })
        //     .then((rs: Array<any>) => {
        //         setDados(rs)
        //         console.log('resultado do rs:', rs)
        //     })

        const campo = 'nome'
        const itemPesquisa = '2024-09-28'
        clsApi.execute<Array<PedidoInterface>>({
            url: 'pedidosEspumasProgramadas',
            method: 'post',
            itemPesquisa,
            campo,
            mensagem: 'Pesquisando espumas ...',
            setMensagemState: setMensagemState
        })
            .then((rs) => {
                setDados(rs)
                console.log('resultado do rs:', rs)
            })

        clsApi.execute<Array<PedidoInterface>>({
            url: 'pedidosTecidosProgramadas',
            method: 'post',
            itemPesquisa,
            campo,
            mensagem: 'Pesquisando tecidos ...',
            setMensagemState: setMensagemState
        })
            .then((rs) => {
                setDadosFilter(rs)
                console.log('resultado interno do rs:', rs)
            })

        clsCrud
            .pesquisar({
                entidade: "PrazoEntrega",
                campoOrder: ["nome"],
                criterio: {
                    nome: "%".concat("%"),
                },
                camposLike: ["nome"],
            })
            .then((rs: Array<PrazoEntregaInterface>) => {
                setRsPrazo(rs)
            })

        clsCrud
            .pesquisar({
                entidade: "Pessoa",
                campoOrder: ['nome'],
                comparador: 'I',
                criterio: {
                    tipoPessoa: ['J', 'C'],
                },
                camposLike: ['tipoPessoa'],
            })
            .then((rsClientes: Array<PessoaInterface>) => {
                setRsCliente(rsClientes)
            })

        clsCrud
            .pesquisar({
                entidade: "Pessoa",
                campoOrder: ['nome'],
                criterio: {
                    tipoPessoa: "V",
                },
                camposLike: ["tipoPessoa"],
            })
            .then((rsVendedores: Array<PessoaInterface>) => {
                setRsVendedor(rsVendedores)
            })
    }

    useEffect(() => {
        BuscarDados()
    }, [])
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="print-container">
            <h1>Relatório de Dados</h1>
            <Button variant="contained" color="primary" onClick={handlePrint}>
                Imprimir
            </Button>
            <TableContainer component={Paper} className="print-table-container">
                <Table >
                    <TableHead>
                        <TableRow>
                            {cabecalhoTabela.map((coluna, indice) => (
                                <TableCell
                                    key={indice}
                                    align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                                    style={{ minWidth: coluna.largura }}
                                    sortDirection={orderBy === coluna.campo ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === coluna.campo}
                                        direction={orderBy === coluna.campo ? order : 'asc'}
                                        sx={{ ml: 0.15 }}
                                    >
                                        {coluna.cabecalho}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stableSort(dados, getComparator(order, orderBy))
                            .map((row, indice) => {

                                return (
                                    <TableRow
                                        key={indice}
                                    >
                                        {
                                            cabecalhoTabela.map((coluna, indice) => {
                                                return (
                                                    <TableCell
                                                        key={indice}
                                                        align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                                                        {coluna.format ? coluna.format((row as any)[coluna.campo], row) : (row as any)[coluna.campo]}
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        {cabecalhoTabelaDetalhes.map((coluna, indice) => (
                                                                            <TableCell
                                                                                key={indice}
                                                                                align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                                                                                style={{ minWidth: coluna.largura }}
                                                                                sortDirection={orderBy === coluna.campo ? order : false}
                                                                            >
                                                                                <TableSortLabel
                                                                                    active={orderBy === coluna.campo}
                                                                                    direction={orderBy === coluna.campo ? order : 'asc'}
                                                                                    sx={{ ml: 0.15 }}
                                                                                >
                                                                                    {coluna.cabecalho}
                                                                                </TableSortLabel>
                                                                            </TableCell>

                                                                        ))}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {stableSort(dadosFilter, getComparator(order, orderBy))
                                                                        .map((row, indice) => {

                                                                            return (
                                                                                <TableRow
                                                                                    key={indice}
                                                                                >
                                                                                    {
                                                                                        cabecalhoTabelaDetalhes.map((coluna, indice) => {
                                                                                            return (
                                                                                                <TableCell
                                                                                                    key={indice}
                                                                                                    align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                                                                                                    {coluna.format ? coluna.format((row as any)[coluna.campo], row) : (row as any)[coluna.campo]}
                                                                                                </TableCell>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </TableRow>
                                                                            )
                                                                        })
                                                                    }
                                                                    <Condicional condicao={dadosFilter.length === 0}>
                                                                        <TableRow>
                                                                            <TableCell
                                                                                colSpan={cabecalhoTabelaDetalhes.length + 1}
                                                                                style={{ textAlign: "center" }}
                                                                            >
                                                                                <p>Não Há registros!!!!</p>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </Condicional>
                                                                </TableBody>

                                                            </Table>
                                                        </TableContainer>

                                                    </TableCell>

                                                )
                                            })
                                        }
                                    </TableRow>

                                )
                            })
                        }
                        <Condicional condicao={dados.length === 0}>
                            <TableRow>
                                <TableCell
                                    colSpan={cabecalhoTabela.length + 1}
                                    style={{ textAlign: "center" }}
                                >
                                    <p>Não Há registros!!!!</p>
                                </TableCell>
                            </TableRow>
                        </Condicional>
                    </TableBody>
                    {/* <Condicional condicao={temTotal}>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                TOTAL
                            </TableCell>
                            {colunaSoma.map((column) => (
                                <TableCell
                                    colSpan={1}
                                    align={'center'}
                                    key={column}
                                >
                                    {clsFormatacao.currency(totalColunas[column])}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableFooter>
                </Condicional> */}
                </Table>
            </TableContainer>
        </div>
    );
}