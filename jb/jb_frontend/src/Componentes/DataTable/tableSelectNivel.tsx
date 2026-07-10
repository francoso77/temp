import React, { useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, Checkbox, Box, Toolbar, Typography, IconButton, Collapse,
    Tooltip, TablePagination, Switch, FormControlLabel, Grow
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTheme, alpha } from '@mui/material/styles';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AutorenewTwoToneIcon from '@mui/icons-material/AutorenewTwoTone';
import ClsFormatacao from '../../Utils/ClsFormatacao';

export interface DataTableCabecalhoInterface {
    campo: string;
    cabecalho: string;
    alinhamento?: 'left' | 'right' | 'center';
    largura?: number;
    format?: (arg: any, row: any) => string | number | undefined;
    render?: (arg: any, row: any) => React.ReactNode;
}

interface DataTableSelectProps {
    dados: Array<any>;
    cabecalho: Array<DataTableCabecalhoInterface>;
    cabecalhoDetalhe?: Array<DataTableCabecalhoInterface>;
    acoesDetalhe?: Array<{ icone: string; onAcionador: (row: any) => void; toolTip?: string }>;
    onStatus?: (selecao: number[], setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>) => void;
    detailsField?: string;
}

type Order = 'asc' | 'desc';

const descendingComparator = (a: any, b: any, orderBy: string) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
};

const getComparator = (order: Order, orderBy: string) => {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array: any[], comparator: (a: any, b: any) => number) => {
    const stabilized = array.map((el, index) => [el, index] as [any, number]);
    stabilized.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
};

const DataTableSelect: React.FC<DataTableSelectProps> = ({
    dados = [],
    cabecalho = [],
    cabecalhoDetalhe = [],
    acoesDetalhe = [],
    onStatus,
    detailsField = 'details'
}) => {
    const clsFormatacao = new ClsFormatacao();
    const theme = useTheme();

    const [openRows, setOpenRows] = useState<number[]>([]);
    const [selected, setSelected] = useState<readonly number[]>([]);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dense, setDense] = useState(true);

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowToggle = (index: number) => {
        setOpenRows((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const all = Array.from({ length: dados.length }, (_, i) => i);
            setSelected(all);
        } else setSelected([]);
    };

    const handleSelect = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
        else if (selectedIndex === selected.length - 1)
            newSelected = newSelected.concat(selected.slice(0, -1));
        else if (selectedIndex > 0)
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));

        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const calculateTotals = (details: any[]) => details.reduce((acc, item) => acc + (item.qtd || 0), 0);

    // Soma a quantidade total de todos os detalhes dos pedidos selecionados
    const totalSelecionado = selected.reduce((acc, index) => {
        const detalhes = dados[index]?.[detailsField] || [];
        const somaDetalhes = detalhes.reduce((soma: number, d: any) => soma + (d.qtd || 0), 0);
        return acc + somaDetalhes;
    }, 0);

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                sx={{
                    width: '100%',
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                }}
            >
                <Toolbar
                    sx={{
                        pl: 2,
                        pr: 1,
                        bgcolor:
                            selected.length > 0
                                ? alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                                : undefined,
                    }}
                >
                    <Grow in={true} appear={true}>
                        <Box sx={{ flexGrow: 1 }}>
                            {selected.length > 0 ? (
                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {selected.length} pedido(s) selecionado(s) — Quantidade total: {clsFormatacao.currency(totalSelecionado)}
                                </Typography>
                            ) : (
                                <Typography sx={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
                                    Gerenciador de Pedidos
                                </Typography>
                            )}
                        </Box>
                    </Grow>

                    {selected.length > 0 && (
                        <Tooltip title="Alterar status para produção">
                            <IconButton onClick={() => onStatus && onStatus([...selected], setSelected)}>
                                <AutorenewTwoToneIcon sx={{ fontSize: 28, color: 'green' }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>

                <TableContainer>
                    <Table size={dense ? 'small' : 'medium'}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                                <TableCell />
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < dados.length}
                                        checked={dados.length > 0 && selected.length === dados.length}
                                        onChange={handleSelectAll}
                                        sx={{
                                            color: 'white',
                                            '&.Mui-checked': { color: 'white' },
                                            '&.MuiCheckbox-indeterminate': { color: 'white' },
                                        }}
                                    />
                                </TableCell>
                                {cabecalho.map((col) => (
                                    <TableCell
                                        key={col.campo}
                                        align={col.alinhamento || 'left'}
                                        sortDirection={orderBy === col.campo ? order : false}
                                        sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === col.campo}
                                            direction={orderBy === col.campo ? order : 'asc'}
                                            onClick={() => handleRequestSort(col.campo)}
                                            sx={{ color: 'white', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                                        >
                                            {col.cabecalho}
                                            {orderBy === col.campo && (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                            )}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {stableSort(dados, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isSelected = selected.includes(index);
                                    const details = row[detailsField] ?? [];
                                    const totalQtd = calculateTotals(details);

                                    return (
                                        <React.Fragment key={index}>
                                            <TableRow
                                                hover
                                                selected={isSelected}
                                                sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.1) } }}
                                            >
                                                <TableCell>
                                                    <IconButton onClick={() => handleRowToggle(index)}>
                                                        {openRows.includes(index) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isSelected}
                                                        onClick={(event) => handleSelect(event, index)}
                                                    />
                                                </TableCell>

                                                {cabecalho.map((col) => (
                                                    <TableCell key={col.campo} align={col.alinhamento || 'left'} sx={{ fontSize: '0.8rem' }}>
                                                        {col.render
                                                            ? col.render(row[col.campo], row)
                                                            : col.format
                                                                ? col.format(row[col.campo], row)
                                                                : row[col.campo]}
                                                    </TableCell>
                                                ))}
                                            </TableRow>

                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={cabecalho.length + 2}>
                                                    <Collapse in={openRows.includes(index)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ m: 1 }}>
                                                            <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                                                Detalhes do Pedido (Total: {clsFormatacao.currency(totalQtd)})
                                                            </Typography>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.8) }}>
                                                                        {cabecalhoDetalhe.map((col) => (
                                                                            <TableCell key={col.campo} sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                                                                                {col.cabecalho}
                                                                            </TableCell>
                                                                        ))}
                                                                        {acoesDetalhe.length > 0 && (
                                                                            <TableCell sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>Ações</TableCell>
                                                                        )}
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {details.length > 0 ? (
                                                                        details.map((det: any, i: number) => (
                                                                            <TableRow key={i}>
                                                                                {cabecalhoDetalhe.map((col) => (
                                                                                    <TableCell key={col.campo} align={col.alinhamento || 'left'} sx={{ fontSize: '0.8rem' }}>
                                                                                        {col.render
                                                                                            ? col.render(det[col.campo], det)
                                                                                            : col.format
                                                                                                ? col.format(det[col.campo], det)
                                                                                                : det[col.campo]}
                                                                                    </TableCell>
                                                                                ))}
                                                                                {acoesDetalhe.length > 0 && (
                                                                                    <TableCell>
                                                                                        {acoesDetalhe.map((acao, j) => (
                                                                                            <Tooltip key={j} title={acao.toolTip}>
                                                                                                <IconButton onClick={() => acao.onAcionador(det)} size="small">
                                                                                                    <span className="material-icons" style={{ fontSize: 18 }}>
                                                                                                        {acao.icone}
                                                                                                    </span>
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                        ))}
                                                                                    </TableCell>
                                                                                )}
                                                                            </TableRow>
                                                                        ))
                                                                    ) : (
                                                                        <TableRow>
                                                                            <TableCell colSpan={cabecalhoDetalhe.length + 1} align="center" sx={{ fontSize: '0.8rem' }}>
                                                                                Nenhum detalhe encontrado
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={dados.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Linhas por página:"
                    sx={{ fontSize: '0.8rem' }}
                />

                <FormControlLabel
                    control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} />}
                    label="Compacto"
                    sx={{ ml: 2, fontSize: '0.8rem' }}
                />
            </Paper>
        </Box>
    );
};

export default DataTableSelect;