import React, { useState } from 'react'
import { tableCellClasses, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Box } from '@mui/material'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles'
import Condicional from '../Condicional/Condicional';

type Order = 'asc' | 'desc';

export interface DataTableCabecalhoInterface {
  campo: string
  cabecalho: string
  alinhamento?: 'left' | 'right' | 'center'
  largura?: number
  format?: (arg?: any) => void
}

export interface DataTableInterface {
  dados: any[]
  cabecalho: Array<DataTableCabecalhoInterface>
  onEditar?: (arg?: any) => void
  onExcluir?: (arg?: any) => void
  onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof any) => void;
  order: Order;
  orderBy: string | number | symbol;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    padding: 10,
    backgroundColor: theme.palette.primary.main,
    fontSize: 15,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
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

export default function DataTable({
  dados = [],
  cabecalho = [],
  onEditar,
  onExcluir,
  onRequestSort,
  order,
  orderBy,
}: DataTableInterface) {

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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

  return (
    <>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <StyledTableRow>
              {cabecalho.map((coluna, indice) => (
                <StyledTableCell
                  key={indice}
                  style={{ minWidth: coluna.largura }}
                  sortDirection={orderBy === coluna.campo ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === coluna.campo}
                    direction={orderBy === coluna.campo ? order : 'asc'}
                    onClick={createSortHandler(coluna.campo)}
                  >
                    {coluna.cabecalho}
                  </TableSortLabel>
                </StyledTableCell>
              ))}

              <Condicional condicao={typeof onEditar == 'function' || typeof onExcluir == 'function'}>
                <StyledTableCell>
                  Opções
                </StyledTableCell>
              </Condicional>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {stableSort(dados, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, indice) => {

                return (
                  <StyledTableRow key={indice}>
                    {
                      cabecalho.map((coluna, indice) => {
                        return (
                          <StyledTableCell
                            key={indice}
                            align={coluna.alinhamento ? coluna.alinhamento : 'left'}>
                            {coluna.format ? coluna.format((row as any)[coluna.campo]) : (row as any)[coluna.campo]}
                          </StyledTableCell>
                        )
                      })
                    }

                    <Condicional condicao={typeof onEditar == 'function' || typeof onExcluir == 'function'}>
                      <StyledTableCell>
                        <Stack direction="row" spacing={1}>
                          <Condicional condicao={typeof onExcluir == 'function'}>
                            <IconButton onClick={() => (onExcluir as any)(row)} sx={{ mx: 0, px: 0 }}>
                              <DeleteIcon></DeleteIcon>
                            </IconButton>
                          </Condicional>
                          <Condicional condicao={typeof onEditar == 'function'}>
                            <IconButton onClick={() => (onEditar as any)(row)} sx={{ mx: 0, px: 0 }}>
                              <EditIcon></EditIcon>
                            </IconButton>
                          </Condicional>
                        </Stack>
                      </StyledTableCell>
                    </Condicional>
                  </StyledTableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage="Qtd: "
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={dados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )

}