import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Box, Toolbar, Typography, IconButton, Collapse,
  Tooltip, TablePagination, Switch, FormControlLabel, Grow,
  Icon
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTheme, alpha } from '@mui/material/styles';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import Condicional from '../Condicional/Condicional';
import { DataTableAcaoInterface } from '.';

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
  acoes?: Array<DataTableAcaoInterface<any>>
  acoesDetalhe?: Array<{ icone: string; onAcionador: (row: any) => void; toolTip?: string }>;
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

const stableSort = (array: any[], comparator: any) => {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
};

const DataTableSemSelect: React.FC<DataTableSelectProps> = ({
  dados = [],
  cabecalho = [],
  cabecalhoDetalhe = [],
  acoesDetalhe = [],
  acoes = [],
  detailsField = 'details'
}) => {
  const clsFormatacao = new ClsFormatacao();
  const theme = useTheme();

  const [openRows, setOpenRows] = useState<number[]>([]);
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

  const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateTotals = (details: any[]) =>
    details.reduce((acc, item) => acc + (item.qtd || 0), 0);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
        <Toolbar sx={{ pl: 2, pr: 1 }}>
          <Grow in={true} appear={true}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600 }}>
                Gerenciador de Pedidos
              </Typography>
            </Box>
          </Grow>
        </Toolbar>

        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableCell />
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
                <Condicional condicao={acoes.length > 0}>
                  <TableCell align='center'>
                    Ações
                  </TableCell>
                </Condicional>
              </TableRow>
            </TableHead>

            <TableBody>
              {stableSort(dados, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const details = row[detailsField] ?? [];
                  const totalQtd = calculateTotals(details);

                  return (
                    <React.Fragment key={index}>
                      <TableRow hover sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.light, 0.1) } }}>
                        <TableCell>
                          <IconButton onClick={() => handleRowToggle(index)}>
                            {openRows.includes(index) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          </IconButton>
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
                        <Condicional condicao={acoes.length > 0}>
                          <TableCell align='center' sx={{ mx: 0, px: 0 }}
                          >
                            {acoes.map((acao, index) => (
                              <Tooltip title={acao.toolTip} key={index}>
                                <span>
                                  <IconButton
                                    disabled={acao.onDisabled ? acao.onDisabled(row as any) : false}
                                    onClick={() => acao.onAcionador(row as any, index)}
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
                          </TableCell>
                        </Condicional>
                      </TableRow>

                      {/* Detalhes */}
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={cabecalho.length + 1}>
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
                                      <TableCell sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Ações
                                      </TableCell>
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

export default DataTableSemSelect;
