import React, { useContext, useState } from 'react'
import { useTheme, tableCellClasses, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, Icon, TableFooter, Checkbox, Box, Toolbar, Typography, FormControlLabel } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { alpha } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Condicional from '../../Componentes/Condicional/Condicional'
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import { KeyboardArrowDown, KeyboardArrowUp, ArrowDownward, ArrowUpward, Delete, Print } from '@mui/icons-material';



type Order = 'asc' | 'desc';

export interface DataTableAcaoInterface<T> {
    toolTip: string
    onAcionador: (arg: T, index: number) => void
    icone: string
    corIcone?: string
    onDisabled?: (arg: T) => boolean
}

export interface DataTableCabecalhoInterface {
    campo: string
    cabecalho: string
    alinhamento?: 'left' | 'right' | 'center'
    largura?: number
    format?: (arg: any, row: any) => string | number | undefined
}

export interface DataTableInterface {
    dados: Array<any>
    cabecalho: Array<DataTableCabecalhoInterface>
    acoes?: Array<DataTableAcaoInterface<any>>
    onSelecionarLinha?: (
        rs: { [key: string]: number | string } | Object,
        linha: number
    ) => void
    exibirPaginacao?: boolean
    onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof any) => void;
    order: Order;
    orderBy: string | number | symbol;
    temTotal?: boolean;
    colunaSoma?: Array<string>;
    // qtdColunas?: number;
}

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        padding: '1px',
        fontSize: '0.55rem',
        [theme.breakpoints.up('md')]: {
            padding: '2px',
            fontSize: '0.80rem',
        },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.head}:nth-of-type(1)`]: {
        padding: '1px',
        fontSize: '0.55rem',
        [theme.breakpoints.up('md')]: {
            padding: '2px',
            fontSize: '0.80rem',
        },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        position: "sticky",
        left: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        padding: '1px',
        fontSize: '0.55rem',
        [theme.breakpoints.up('md')]: {
            padding: '2px',
            fontSize: '0.75rem',
        },
    },
    [`&.${tableCellClasses.body}:nth-of-type(1)`]: {
        padding: '1px',
        fontSize: '0.55rem',

        [theme.breakpoints.up('md')]: {
            padding: '2px',
            fontSize: '0.75rem',
        },
        position: "sticky",
        left: 0,
        backgroundColor: "#FFFF",
    },
    [`&.${tableCellClasses.footer}`]: {
        padding: '1px',
        fontSize: '0.55rem',
        [theme.breakpoints.up('md')]: {
            padding: '2px',
            fontSize: '0.75rem',
        },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.footer}:nth-of-type(1)`]: {
        padding: '1px',
        fontSize: '0.55rem',
        [theme.breakpoints.up('md')]: {
            padding: '2px',
            fontSize: '0.75rem',
        },
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        position: "sticky",
        left: 0,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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

interface EnhancedTableProps {
    numSelected: number;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rowCount: number;
    onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof any) => void;
    order: Order;
    orderBy: string | number | symbol;
}

export default function DataTableSelect<T>({
    dados = [],
    cabecalho = [],
    acoes = [],
    onSelecionarLinha = undefined,
    exibirPaginacao = true,
    onRequestSort,
    order,
    orderBy,
    temTotal = false,
    colunaSoma = [],
}: DataTableInterface) {

    const clsFormatacao = new ClsFormatacao()
    const theme = useTheme()
    const [openRows, setOpenRows] = useState<number[]>([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [dense, setDense] = React.useState(false)
    const [selected, setSelected] = React.useState<readonly number[]>([])
    const { layoutState } = useContext(GlobalContext) as GlobalContextInterface

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
            if (typeof onRequestSort == 'function') {
                onRequestSort(event, property);
            }
        }

    const totalColunas = sumColumns(dados, colunaSoma)


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
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selecionado(s)
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {layoutState.titulo}
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => {
                                selected.forEach(i => {
                                    if (i < dados.length) {
                                        console.log(dados[i]);
                                    }
                                })
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filtros">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
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
                                onRequestSort={onRequestSort}
                                rowCount={dados.length}
                            />
                            <TableBody>
                                {stableSort(dados, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, indice) => {
                                        const isItemSelected = selected.includes(indice);
                                        const labelId = `enhanced-table-checkbox-${indice}`;
                                        return (
                                            <TableRow
                                                hover
                                                onClick={() => onSelecionarLinha ? onSelecionarLinha(row, page * rowsPerPage + indice) : ""}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={indice}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <IconButton onClick={() => handleRowClick(indice)}>
                                                        {openRows.includes(indice) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        onClick={(event) => handleClick(event, indice)}
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                {
                                                    cabecalho.map((coluna, indice) => {
                                                        return (
                                                            <StyledTableCell
                                                                key={indice}
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
                                            </TableRow>
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
                                <Condicional condicao={temTotal}>
                                    <TableFooter>
                                        <StyledTableRow>
                                            <StyledTableCell>
                                                TOTAL
                                            </StyledTableCell>
                                            {colunaSoma.map((column) => (
                                                <StyledTableCell
                                                    colSpan={1}
                                                    align={'center'}
                                                    key={column}
                                                >
                                                    {clsFormatacao.currency(totalColunas[column])}
                                                </StyledTableCell>
                                            ))}
                                        </StyledTableRow>
                                    </TableFooter>
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