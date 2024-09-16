import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Box,
  Typography,
  Checkbox,
  TableSortLabel,
  Button,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, ArrowDownward, ArrowUpward, Delete, Print } from '@mui/icons-material';

interface ItemDetail {
  detailId: number;
  description: string;
  quantidade: number;
  valor: number;
}

interface Item {
  id: number;
  name: string;
  status: string;
  data: string;
  nome: string;
  details: ItemDetail[];
}

const exampleData: Item[] = [
  {
    id: 1,
    name: 'Item 1',
    status: 'Ativo',
    data: '2024-01-01',
    nome: 'John',
    details: [
      { detailId: 101, description: 'Detail 1 for Item 1', quantidade: 2, valor: 100 },
      { detailId: 102, description: 'Detail 2 for Item 1', quantidade: 3, valor: 150 },
    ],
  },
  {
    id: 2,
    name: 'Item 2',
    status: 'Inativo',
    data: '2024-02-01',
    nome: 'Jane',
    details: [
      { detailId: 201, description: 'Detail 1 for Item 2', quantidade: 1, valor: 200 },
      { detailId: 202, description: 'Detail 2 for Item 2', quantidade: 4, valor: 300 },
    ],
  },
  {
    id: 3,
    name: 'Item 3',
    status: 'Ativo',
    data: '2024-03-01',
    nome: 'Alice',
    details: [
      { detailId: 301, description: 'Detail 1 for Item 3', quantidade: 5, valor: 500 },
      { detailId: 302, description: 'Detail 2 for Item 3', quantidade: 2, valor: 250 },
    ],
  },
];

const CollapsibleTable: React.FC = () => {
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Item>('name');
  const [data, setData] = useState<Item[]>(exampleData);

  const handleRowClick = (id: number) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(id) ? prevOpenRows.filter((rowId) => rowId !== id) : [...prevOpenRows, id]
    );
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(exampleData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRequestSort = (property: keyof Item) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);

    const sortedData = [...data].sort((a, b) => {
      if (a[property] < b[property]) return isAsc ? -1 : 1;
      if (a[property] > b[property]) return isAsc ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  const handleDeleteSelected = () => {
    const filteredData = data.filter((item) => !selectedRows.includes(item.id));
    setData(filteredData);
    setSelectedRows([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const calculateTotals = (details: ItemDetail[]) => {
    const totalQuantidade = details.reduce((sum, detail) => sum + detail.quantidade, 0);
    const totalValor = details.reduce((sum, detail) => sum + detail.valor, 0);
    return { totalQuantidade, totalValor };
  };

  const isAllSelected = selectedRows.length === exampleData.length;

  return (
    <TableContainer component={Paper}>
      {/* Exibe a quantidade de itens selecionados e os botões de ação */}
      {selectedRows.length > 0 ? (
        <Box padding={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Itens Selecionados: {selectedRows.length}</Typography>
          <Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteSelected}
              style={{ marginRight: 8 }}
            >
              Excluir
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
          </Box>
        </Box>
      ) : (
        <Box padding={2} display="flex" justifyContent="center">
          <Typography variant="h6">Gerenciamento de Pedidos</Typography>
        </Box>
      )}

      <Table>
        <TableHead sx={{ backgroundColor: 'primary.main' }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={isAllSelected}
                indeterminate={selectedRows.length > 0 && !isAllSelected}
                onChange={handleSelectAllClick}
              />
            </TableCell>
            <TableCell />
            <TableCell>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleRequestSort('name')}
                sx={{ color: 'primary.contrastText' }}
              >
                Item Name
                {orderBy === 'name' && (
                  <Box component="span" sx={{ visibility: 'hidden' }}>
                    {order === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={() => handleRequestSort('status')}
                sx={{ color: 'primary.contrastText' }}
              >
                Status
                {orderBy === 'status' && (
                  <Box component="span" sx={{ visibility: 'hidden' }}>
                    {order === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'data'}
                direction={orderBy === 'data' ? order : 'asc'}
                onClick={() => handleRequestSort('data')}
                sx={{ color: 'primary.contrastText' }}
              >
                Data
                {orderBy === 'data' && (
                  <Box component="span" sx={{ visibility: 'hidden' }}>
                    {order === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'nome'}
                direction={orderBy === 'nome' ? order : 'asc'}
                onClick={() => handleRequestSort('nome')}
                sx={{ color: 'primary.contrastText' }}
              >
                Nome
                {orderBy === 'nome' && (
                  <Box component="span" sx={{ visibility: 'hidden' }}>
                    {order === 'desc' ? <ArrowDownward /> : <ArrowUpward />}
                  </Box>
                )}
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            const { totalQuantidade, totalValor } = calculateTotals(item.details);

            return (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <IconButton onClick={() => handleRowClick(item.id)}>
                      {openRows.includes(item.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                </TableRow>
                <TableRow

                  style={{
                    backgroundColor: openRows.includes(item.id) ? '#f5f5f5' : 'transparent',
                  }}
                >
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openRows.includes(item.id)} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Description</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.details.map((detail) => (
                              <TableRow key={detail.detailId}>
                                <TableCell>{detail.description}</TableCell>
                                <TableCell>{detail.quantidade}</TableCell>
                                <TableCell>{detail.valor}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={2} align="right"><strong>Total:</strong></TableCell>
                              <TableCell><strong>{totalQuantidade}</strong></TableCell>
                              <TableCell><strong>{totalValor}</strong></TableCell>
                            </TableRow>
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
  );
};

export default CollapsibleTable;
