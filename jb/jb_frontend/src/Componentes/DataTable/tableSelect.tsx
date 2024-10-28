import React, { useState } from 'react'
import { useTheme, Paper, Table, TableBody, TableContainer, TableHead, TableSortLabel, Tooltip, Icon, TableFooter, Checkbox, Box, Toolbar, Typography, FormControlLabel, Collapse, buttonGroupClasses, TableCell, SpeedDialAction, SpeedDial } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import { visuallyHidden } from '@mui/utils';
import { alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Condicional from '../Condicional/Condicional'
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { DataTableInterface, getComparator, Order, stableSort, StyledTableCell, StyledTableRow, sumColumns } from '.';
import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AutorenewTwoToneIcon from '@mui/icons-material/AutorenewTwoTone';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';

// const actions = [
//     { icon: <PrintIcon />, name: 'Print', click: () => { } },
//     { icon: <ShareIcon />, name: 'Share', click: () => { } },
// ];

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
    },
}));

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
    onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof any) => void;
    order: Order;
    orderBy: string | number | symbol;
}

export default function TableSelect<T>({
    dados = [],
    cabecalho = [],
    acoes = [],
    onStatus = undefined,
    onSelecionarLinha = undefined,
    exibirPaginacao = true,
    ItemSpeed = [],
}: DataTableInterface) {

    const theme = useTheme()
    const [openRows, setOpenRows] = useState<number[]>([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [dense, setDense] = React.useState(true)
    const [selected, setSelected] = React.useState<readonly number[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<keyof any>('nome')

    const handleRowClick = (id: number) => {
        setOpenRows((prevOpenRows) =>
            prevOpenRows.includes(id) ? prevOpenRows.filter((rowId) => rowId !== id) : [...prevOpenRows, id]
        );
    };
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const createSortHandler =
        (property: keyof any) => (event: React.MouseEvent<unknown>) => {
            if (typeof handleRequestSort == 'function') {
                handleRequestSort(event, property);
            }
        }

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof any,
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property);
    }


    function EnhancedTableHead(props: EnhancedTableProps) {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
            props;

        return (
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell padding="checkbox">
                    </StyledTableCell>
                    <StyledTableCell
                        padding="checkbox">
                        <Checkbox
                            color="default"
                            sx={{ color: 'white' }}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />
                    </StyledTableCell>
                    {cabecalho.map((coluna, indice) => (
                        <StyledTableCell
                            key={indice}
                            align={coluna.alinhamento ? coluna.alinhamento : 'left'}
                            padding={'normal'}
                            sortDirection={orderBy === coluna.campo ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === coluna.campo}
                                direction={orderBy === coluna.campo ? order : 'asc'}
                                onClick={createSortHandler(coluna.campo)}
                                sx={{ ml: 0.15 }}
                            >
                                {coluna.cabecalho}
                                {orderBy === coluna.campo && (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                                    </Box>
                                )}
                            </TableSortLabel>
                        </StyledTableCell>
                    ))}
                    <Condicional condicao={acoes.length > 0}>
                        <StyledTableCell align='center'>
                            Opções
                        </StyledTableCell>
                    </Condicional>
                </StyledTableRow>
            </TableHead>
        );
    }

    interface EnhancedTableToolbarProps {
        numSelected: number;
    }

    function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
        const { numSelected } = props;
        return (
            <Toolbar
                sx={[
                    {
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                    },
                    numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    },
                ]}
            >
                {numSelected > 0 ? (
                    <>
                        <Typography
                            sx={{ flex: '1 1 100%', fontSize: '1.5rem' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {numSelected} selecionado(s)
                        </Typography>
                        {/* <Typography
                            sx={{ flex: '1 1 100%', textAlign: 'center', fontSize: '1.5rem' }}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            {clsFormatacao.currency(somaQtd)} metros programados
                        </Typography> */}
                    </>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%', textAlign: 'center', fontSize: '1.5rem' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Pedidos Cortados
                    </Typography>
                )}
                {numSelected <= 0 ? (<></>
                    // <Tooltip title="Gerar Etiquetas">
                    //     <IconButton
                    //         onClick={onStatus ? () => onStatus(selected, setSelected) : undefined}
                    //     >
                    //         <AutorenewTwoToneIcon
                    //             sx={{ fontSize: 40, color: 'green' }}
                    //         />
                    //     </IconButton>
                    // </Tooltip>
                ) : (
                    <Box sx={{ position: 'relative', mr: 10, height: 100 }}>
                        <SpeedDial
                            ariaLabel="Menu de opções"
                            icon={<MoreVertIcon />}
                            direction={'left'}
                            sx={{
                                color: 'green',
                                position: 'absolute',
                                bottom: 23,
                                right: -77,
                                // Aumentar o tamanho do SpeedDial
                                transform: 'scale(1)',
                                '& .MuiFab-primary': {
                                    bgcolor: theme.palette.secondary.main, // Cor de fundo do botão principal
                                    color: 'white', // Cor do ícone
                                    width: 35,
                                    height: 35,
                                    '&:hover': {
                                        bgcolor: 'green', // Cor ao passar o mouse
                                    },
                                },
                                '& .MuiSpeedDialAction-staticTooltipLabel': {
                                    bgcolor: 'black', // Cor de fundo dos tooltips
                                    color: 'white', // Cor do texto nos tooltips
                                },
                            }}

                        >
                            {ItemSpeed.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={onStatus ? () => onStatus(selected, setSelected, action.tipo) : undefined}
                                />
                            ))}
                        </SpeedDial>
                    </Box>
                )}
            </Toolbar>
        );
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = dados.map((_n, i) => i);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected)
        //somaQtdSelected(newSelected)
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked)
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={dados.length}
                            />
                            <TableBody>
                                {stableSort(dados, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, indice) => {

                                        const isItemSelected = selected.includes(indice);
                                        const labelId = `enhanced-table-checkbox-${indice}`;

                                        return (
                                            <React.Fragment key={indice}>
                                                <StyledTableRow
                                                    hover
                                                    onClick={() => onSelecionarLinha ? onSelecionarLinha(row, page * rowsPerPage + indice) : ""}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={indice}
                                                    selected={isItemSelected}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <StyledTableCell padding="checkbox">
                                                    </StyledTableCell>
                                                    <StyledTableCell padding="checkbox">
                                                        <Checkbox
                                                            onClick={(event) => handleClick(event, indice)}
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            inputProps={{
                                                                'aria-labelledby': labelId,
                                                            }}
                                                        />
                                                    </StyledTableCell>
                                                    {
                                                        cabecalho.map((coluna, indice) => {
                                                            return (
                                                                <StyledTableCell
                                                                    key={indice}
                                                                    sx={{
                                                                        color: (row as any)[coluna.campo] === "A" ? 'green' :
                                                                            (row as any)[coluna.campo] === "F" ? 'red' :
                                                                                (row as any)[coluna.campo] === "C" ? 'orange' :
                                                                                    (row as any)[coluna.campo] === "P" ? 'royalblue' : 'default'
                                                                    }}
                                                                    align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                                                                    {coluna.format ? coluna.format((row as any)[coluna.campo], row) : (row as any)[coluna.campo]}
                                                                </StyledTableCell>
                                                            )
                                                        })
                                                    }
                                                    <Condicional condicao={acoes.length > 0}>
                                                        <StyledTableCell align='center' sx={{ mx: 0, px: 0 }}
                                                        >
                                                            {acoes.map((acao, index) => (
                                                                <Tooltip title={acao.toolTip} key={index}>
                                                                    <span>
                                                                        <IconButton
                                                                            disabled={acao.onDisabled ? acao.onDisabled(row as T) : false}
                                                                            onClick={selected.length === 0 ? () => acao.onAcionador(row as T, indice) : () => { }}
                                                                            sx={{ mx: 0, px: 0 }}
                                                                        >
                                                                            <Icon
                                                                                sx={{
                                                                                    color: acao.corIcone ? acao.corIcone : theme.palette.secondary.main,
                                                                                    fontSize: '1.25rem',
                                                                                    mx: 0,
                                                                                    px: 0,
                                                                                    [theme.breakpoints.up('md')]: {
                                                                                        fontSize: '1.55rem',
                                                                                    },
                                                                                }}
                                                                            >
                                                                                {acao.icone}
                                                                            </Icon>
                                                                        </IconButton>
                                                                    </span>
                                                                </Tooltip>
                                                            ))}
                                                        </StyledTableCell>
                                                    </Condicional>
                                                </StyledTableRow>
                                            </ React.Fragment>
                                        );
                                    })}
                                <Condicional condicao={dados.length === 0}>
                                    <StyledTableRow>
                                        <StyledTableCell
                                            colSpan={cabecalho.length + 1}
                                            style={{ textAlign: "center" }}
                                        >
                                            <p>Não Há registros!!!!</p>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </Condicional>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Condicional condicao={exibirPaginacao}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dados.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Condicional>
                </Paper>
                <FormControlLabel
                    control={<Switch checked={dense} onChange={handleChangeDense} />}
                    label="Slim"
                />
            </Box>

        </>
    )
}