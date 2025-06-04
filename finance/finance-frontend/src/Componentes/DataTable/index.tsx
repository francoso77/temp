import React, { useState } from 'react'
import { useTheme, tableCellClasses, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip, TableFooter, Chip, SvgIconProps } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Condicional from '../Condicional/Condicional';
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

  // 👇 Novas props opcionais para suporte ao Chip
  chipColor?: (valor: any, row?: any) => 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  chipLabel?: (valor: any, row?: any) => string // caso queira customizar o texto do chip
}

export interface ItemSpeedDial {
  icon: JSX.Element;
  name: string;
  tipo: "etiqueta" | "romaneio";
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
  onStatus?: (selecao: any, setSelected: React.Dispatch<React.SetStateAction<readonly number[]>>, tipo: "etiqueta" | "romaneio") => void
  onSelecionarLinha?: (
    rs: { [key: string]: number | string } | Object,
    linha: number
  ) => void
  exibirPaginacao?: boolean
  temTotal?: boolean;
  colunaSoma?: Array<string>;
  ItemSpeed?: Array<ItemSpeedDial>;
  tituloTabela?: string;
  qtdColunas?: number;
}


export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
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

// //formatando o valor somado
// const formatNumber = (number: number, locale: string): string => {
//   return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, }).format(number);
// };

// //Somando a coluna informada para totalizar na tabela
// const sumColumn = (data: Array<any>, column: string): number => {
//   return data.reduce((sum, row) => sum + row[column], 0);
// };

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
  tituloTabela = "Dados",
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
      padding: '1px',
      fontSize: '0.55rem',

      [theme.breakpoints.up('md')]: {
        padding: '2px',
        fontSize: '0.80rem',
      },
      backgroundColor: '#3a3a3a',
      color: theme.palette.common.white,
      position: "sticky",
      left: 0,

    },
    [`&.${tableCellClasses.body}`]: {
      padding: '1px',
      fontSize: '0.65rem',
      [theme.breakpoints.up('md')]: {
        padding: '2px',
        fontSize: '0.75rem',
        border: borderSize + 'px solid ' + borderColor,

      },
      backgroundColor: backgroundColor ? backgroundColor : theme.palette.primary.main,
      color: theme.palette.common.white,
      border: borderSize + 'px solid ' + borderColor,


    },
    [`&.${tableCellClasses.body}:nth-of-type(1)`]: {
      padding: '4px',
      fontSize: '0.65rem',
      [theme.breakpoints.up('md')]: {
        padding: '7px',
        fontSize: '0.75rem',
        border: borderSize + 'px solid ' + borderColor,

      },
      position: "sticky",
      left: 0,
      backgroundColor: backgroundColor ? backgroundColor : theme.palette.primary.main,
      color: theme.palette.common.white,
      border: borderSize + 'px solid ' + borderColor,


    },
    [`&.${tableCellClasses.footer}`]: {
      padding: '1px',
      fontSize: '0.55rem',
      [theme.breakpoints.up('md')]: {
        padding: '2px',
        fontSize: '0.75rem',
        border: borderSize + 'px solid ' + borderColor,

      },
      backgroundColor: '#3a3a3a',
      color: theme.palette.common.white,
      border: borderSize + 'px solid ' + borderColor,

    },
    [`&.${tableCellClasses.footer}:nth-of-type(1)`]: {
      padding: '1px',
      fontSize: '0.55rem',
      [theme.breakpoints.up('md')]: {
        padding: '2px',
        fontSize: '0.75rem',
        border: borderSize + 'px solid ' + borderColor,

      },
      backgroundColor: '#3a3a3a',
      color: theme.palette.common.white,
      position: "sticky",
      left: 0,
      border: borderSize + 'px solid ' + borderColor,

    },


  }))

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: backgroundColor ? backgroundColor : theme.palette.primary.main,
      border: borderSize + 'px solid ' + borderColor,


    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: borderSize + 'px solid ' + borderColor,
    },
  }));

  const clsFormatacao = new ClsFormatacao()
  const theme = useTheme()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome')


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

  const totalColunas = sumColumns(dados, colunaSoma)

  const chipStyle = (valor: string) => {
    switch (valor) {
      case 'Receita':
        return { backgroundColor: '#2e7d32', color: '#fff' }; // verde escuro
      case 'Despesa':
        return { backgroundColor: '#d32f2f', color: '#fff' }; // vermelho
      case 'status':
        return { backgroundColor: '#616161', color: '#fff' }; // cinza
      default:
        return { backgroundColor: '#616161', color: '#fff' }; // cinza
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>
            <StyledTableRow >
              {cabecalho.map((coluna, indice) => (
                <StyledTableCell
                  key={indice}
                  align={coluna.alinhamento ? coluna.alinhamento : 'left'}
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
                <StyledTableCell align='center'>
                  Ações
                </StyledTableCell>
              </Condicional>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {stableSort(dados, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, indice) => {

                return (
                  <StyledTableRow
                    key={indice}
                    onClick={() => onSelecionarLinha ? onSelecionarLinha(row, page * rowsPerPage + indice) : ""}
                  >
                    {
                      cabecalho.map((coluna, indice) => {
                        return (
                          <StyledTableCell
                            key={indice}
                            align={coluna.alinhamento ?? 'left'}
                          >
                            {
                              coluna.render
                                ? coluna.render((row as any)[coluna.campo], row)
                                : coluna.chipColor
                                  ? (
                                    <Chip
                                      variant="outlined"
                                      label={coluna.chipLabel
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
                                    : (row as any)[coluna.campo]
                            }
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
                                onClick={() => acao.onAcionador(row as T, indice)}
                                sx={{ mx: 0, px: 0 }}
                              >
                                <acao.icone
                                  sx={{
                                    color: acao.corIcone ?? theme.palette.secondary.main,
                                    fontSize: '1.25rem',
                                    [theme.breakpoints.up('md')]: {
                                      fontSize: '1.55rem',
                                    },
                                  }}
                                />
                                {/* <Icon
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
                                </Icon> */}

                              </IconButton>
                            </span>
                          </Tooltip>
                        ))}
                      </StyledTableCell>
                    </Condicional>
                  </StyledTableRow>
                )
              })
            }
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
          <Condicional condicao={temTotal}>
            <TableFooter>
              <StyledTableRow>
                <StyledTableCell>
                  TOTAL
                </StyledTableCell>
                {colunaSoma.map((column) => (
                  <StyledTableCell
                    colSpan={qtdColunas}
                    align={'center'}
                    key={column}
                  >
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
          rowsPerPageOptions={[10, 25,
            { value: dados && dados.length ? dados.length : 0, label: "Todos" },
          ]}
          component="div"
          count={dados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: '#3a3a3a',
            color: '#fff',
            borderLeft: borderSize + 'px solid ' + borderColor,
            borderRight: borderSize + 'px solid ' + borderColor,
            borderBottom: borderSize + 'px solid ' + borderColor,
            borderRadius: '4px',
            '& .MuiTablePagination-selectIcon': {
              color: '#fff', // Cor desejada para a seta
            },
            '& .MuiTablePagination-actions svg': {
              color: '#ffffff', // Altere para a cor desejada
            },
            '& .MuiTablePagination-toolbar': {
              padding: theme.spacing(1),
              [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(0.5),
              },
              [theme.breakpoints.up('md')]: {
                padding: theme.spacing(1.5),
              },
              [theme.breakpoints.up('lg')]: {
                padding: theme.spacing(2),
              },
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.65rem',
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.55rem',
              },
              [theme.breakpoints.up('md')]: {
                fontSize: '0.75rem',
              },
              [theme.breakpoints.up('lg')]: {
                fontSize: '1rem',
              },
            },
            '& .MuiTablePagination-select': {
              fontSize: '0.65rem',
              [theme.breakpoints.down('sm')]: {
                fontSize: '0.55rem',
              },
              [theme.breakpoints.up('md')]: {
                fontSize: '0.75rem',
              },
              [theme.breakpoints.up('lg')]: {
                fontSize: '1rem',
              },
            },
          }}
        />
      </Condicional>
    </>
  )

}