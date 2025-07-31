import React, { useState } from 'react'
import {
  useTheme,
  tableCellClasses,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  TableFooter,
  Chip,
  SvgIconProps
} from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Condicional from '../Condicional/Condicional'
import ClsFormatacao from '../../Utils/ClsFormatacao'

export type Order = 'asc' | 'desc';

export interface DataTableAcaoInterface<T> {
  toolTip: string
  onAcionador: (arg: T, index: number) => void
  icone: React.ElementType<SvgIconProps>
  corIcone?: string
  onDisabled?: (arg: T) => boolean
}

export interface DataTableCabecalhoInterface {
  campo: string
  cabecalho: string
  alinhamento?: 'left' | 'right' | 'center'
  largura?: number
  format?: (arg: any, row: any) => string | number | undefined
  render?: (arg: any, row: any) => React.ReactNode
  chipColor?: (valor: any, row?: any) => 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  chipLabel?: (valor: any, row?: any) => string
}

export interface ItemSpeedDial {
  icon: JSX.Element
  name: string
  tipo: 'etiqueta' | 'romaneio'
}

export interface DataTableInterface {
  backgroundColor?: string
  borderColor?: string
  borderSize?: number
  dados: Array<any>
  cabecalho: Array<DataTableCabecalhoInterface>
  cabecalhoDetalhe?: Array<any>
  acoes?: Array<DataTableAcaoInterface<any>>
  acoesDetalhe?: Array<DataTableAcaoInterface<any>>
  onStatus?: (selecao: any, setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>, tipo: 'etiqueta' | 'romaneio') => void
  onSelecionarLinha?: (rs: { [key: string]: number | string } | Object, linha: number) => void
  exibirPaginacao?: boolean
  temTotal?: boolean
  colunaSoma?: Array<string>
  ItemSpeed?: Array<ItemSpeedDial>
  tituloTabela?: string
  qtdColunas?: number
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    return order !== 0 ? order : a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function smartComparator<T>(order: Order, orderBy: keyof T) {
  return (a: T, b: T) => {
    const valA = a[orderBy];
    const valB = b[orderBy];

    const isDate = (v: any) => typeof v === 'string' && !isNaN(Date.parse(v));
    const normalize = (v: any) => v === null || v === undefined ? '' : v;

    const aVal = normalize(valA);
    const bVal = normalize(valB);

    let comparison = 0;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal;
    } else if (isDate(aVal) && isDate(bVal)) {
      comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
    } else if (typeof aVal === 'string' || typeof bVal === 'string') {
      comparison = String(aVal).localeCompare(String(bVal), 'pt-BR', {
        numeric: true,
        sensitivity: 'base',
      });
    }

    return order === 'asc' ? comparison : -comparison;
  };
}

export const sumColumns = (data: Array<any>, columns: Array<string>): Record<string, number> => {
  return columns.reduce((result, column) => {
    result[column] = data.reduce((sum, row) => sum + row[column], 0);
    return result;
  }, {} as Record<string, number>);
};

export default function DataTable<T>({
  backgroundColor,
  dados = [],
  cabecalho = [],
  acoes = [],
  onStatus = undefined,
  onSelecionarLinha = undefined,
  exibirPaginacao = true,
  temTotal = false,
  colunaSoma = [],
  qtdColunas = 1,
  tituloTabela = 'Dados',
  borderColor = '#3a3a3a',
  borderSize = 1
}: DataTableInterface) {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      padding: '1px',
      fontSize: '0.55rem',
      [theme.breakpoints.up('md')]: {
        padding: '2px',
        fontSize: '0.80rem',
      },
      backgroundColor: '#3a3a3a',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.head}:nth-of-type(1)`]: {
      position: 'sticky',
      left: 0,
    },
    [`&.${tableCellClasses.body}`]: {
      padding: '1px',
      fontSize: '0.65rem',
      [theme.breakpoints.up('md')]: {
        padding: '2px',
        fontSize: '0.75rem',
      },
      backgroundColor: backgroundColor ?? theme.palette.primary.main,
      color: theme.palette.common.white,
      border: `${borderSize}px solid ${borderColor}`,
    },
    [`&.${tableCellClasses.body}:nth-of-type(1)`]: {
      position: 'sticky',
      left: 0,
    },
    [`&.${tableCellClasses.footer}`]: {
      backgroundColor: '#3a3a3a',
      color: theme.palette.common.white,
      border: `${borderSize}px solid ${borderColor}`,
    },
    [`&.${tableCellClasses.footer}:nth-of-type(1)`]: {
      position: 'sticky',
      left: 0,
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: backgroundColor ?? theme.palette.primary.main,
    },
    '&:last-child td, &:last-child th': {
      border: `${borderSize}px solid ${borderColor}`,
    }
  }));

  const clsFormatacao = new ClsFormatacao();
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>(cabecalho[0]?.campo || '');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property);
  };

  const totalColunas = sumColumns(dados, colunaSoma);

  const chipStyle = (valor: string) => {
    switch (valor) {
      case 'Receita': return { backgroundColor: '#2e7d32', color: '#fff' };
      case 'Despesa': return { backgroundColor: '#d32f2f', color: '#fff' };
      case 'status': return { backgroundColor: '#616161', color: '#fff' };
      default: return { backgroundColor: '#616161', color: '#fff' };
    }
  };

  const isSomanteNumero = (value: string): boolean => { return /^\d+$/.test(value) };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              {cabecalho.map((coluna, indice) => (
                <StyledTableCell
                  key={indice}
                  align={coluna.alinhamento ?? 'left'}
                  style={{ minWidth: coluna.largura }}
                  sortDirection={orderBy === coluna.campo ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === coluna.campo}
                    direction={orderBy === coluna.campo ? order : 'asc'}
                    onClick={createSortHandler(coluna.campo)}
                    sx={{ ml: 0.15 }}
                  >
                    {coluna.cabecalho}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
              <Condicional condicao={acoes.length > 0}>
                <StyledTableCell align='center'>Ações</StyledTableCell>
              </Condicional>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {stableSort(dados, smartComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, indice) => (
                <StyledTableRow
                  key={indice}
                  onClick={() => onSelecionarLinha?.(row, page * rowsPerPage + indice)}
                >
                  {cabecalho.map((coluna, index) => (

                    <StyledTableCell
                      key={index}
                      align={coluna.alinhamento ?? 'left'}
                    >
                      {coluna.render
                        ? coluna.render((row as any)[coluna.campo], row)
                        : coluna.chipColor
                          ? (
                            <Chip
                              variant="outlined"
                              label={
                                coluna.chipLabel
                                  ? coluna.chipLabel((row as any)[coluna.campo], row)
                                  : (row as any)[coluna.campo]
                              }
                              color={coluna.chipColor((row as any)[coluna.campo], row)}
                              size="small"
                              sx={{
                                fontWeight: 'bold',
                                ...chipStyle((row as any)[coluna.campo])
                              }}
                            />
                          )
                          : coluna.format
                            ? coluna.format((row as any)[coluna.campo], row)
                            : isSomanteNumero((row as any)[coluna.campo]) ?
                              clsFormatacao.numeroPadrao((row as any)[coluna.campo])
                              : (row as any)[coluna.campo]
                      }
                    </StyledTableCell>
                  ))}
                  <Condicional condicao={acoes.length > 0}>
                    <StyledTableCell align="center">
                      {acoes.map((acao, i) => (
                        <Tooltip title={acao.toolTip} key={i}>
                          <span>
                            <IconButton
                              disabled={acao.onDisabled?.(row)}
                              onClick={() => acao.onAcionador(row, indice)}
                              sx={{ mx: 0, px: 0 }}
                            >
                              <acao.icone
                                sx={{
                                  color: acao.corIcone ?? theme.palette.secondary.main,
                                  fontSize: '1.25rem',
                                  [theme.breakpoints.up('md')]: { fontSize: '1.55rem' },
                                }}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ))}
                    </StyledTableCell>
                  </Condicional>
                </StyledTableRow>
              ))}
            <Condicional condicao={dados.length === 0}>
              <StyledTableRow>
                <StyledTableCell colSpan={cabecalho.length + 1} style={{ textAlign: 'center' }}>
                  <p>Não há registros!</p>
                </StyledTableCell>
              </StyledTableRow>
            </Condicional>
          </TableBody>

          <Condicional condicao={temTotal}>
            <TableFooter>
              <StyledTableRow>
                <StyledTableCell>TOTAL</StyledTableCell>
                {colunaSoma.map((column, idx) => (
                  <StyledTableCell key={idx} colSpan={qtdColunas} align="center">
                    {clsFormatacao.currency(totalColunas[column])}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableFooter>
          </Condicional>
        </Table>
      </TableContainer>

      <Condicional condicao={exibirPaginacao}>
        <TablePagination
          labelRowsPerPage="Qtd: "
          rowsPerPageOptions={[10, 25, { value: dados.length || 0, label: 'Todos' }]}
          component="div"
          count={dados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: '#3a3a3a',
            color: '#fff',
            borderLeft: `${borderSize}px solid ${borderColor}`,
            borderRight: `${borderSize}px solid ${borderColor}`,
            borderBottom: `${borderSize}px solid ${borderColor}`,
            borderRadius: '4px',
            '& .MuiTablePagination-selectIcon': { color: '#fff' },
            '& .MuiTablePagination-actions svg': { color: '#fff' },
            '& .MuiTablePagination-toolbar': {
              padding: theme.spacing(1),
              [theme.breakpoints.down('sm')]: { padding: theme.spacing(0.5) },
              [theme.breakpoints.up('md')]: { padding: theme.spacing(1.5) },
              [theme.breakpoints.up('lg')]: { padding: theme.spacing(2) },
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.65rem',
              [theme.breakpoints.down('sm')]: { fontSize: '0.55rem' },
              [theme.breakpoints.up('md')]: { fontSize: '0.75rem' },
              [theme.breakpoints.up('lg')]: { fontSize: '1rem' },
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.65rem',
              [theme.breakpoints.down('sm')]: { fontSize: '0.55rem' },
              [theme.breakpoints.up('md')]: { fontSize: '0.75rem' },
              [theme.breakpoints.up('lg')]: { fontSize: '1rem' },
            }
          }}
        />
      </Condicional>
    </>
  );
}

