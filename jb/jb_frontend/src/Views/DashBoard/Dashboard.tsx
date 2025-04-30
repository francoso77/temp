import React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import VelocimetroPedidos from './VelocimetroPedidos';
import BarrasPedidosMensais from './BarrasPedidosMensais';
import LinhasTipoProdutos from './LinhasTipoProdutos';
import PedidoStatus from './StatusProgress';
import LinhasTipoProdutos3D from './LinhasTipoProdutos3D';

interface PedidoStatusProps {
  numeroPedido: string;
  status: 'aberto' | 'em produção' | 'fechado';
  dataPedido: string;
  nomeCliente: string;
}
const pedidos: Array<PedidoStatusProps> = [
  { numeroPedido: '12345', status: 'em produção', dataPedido: '2023-02-20', nomeCliente: 'João Silva' },
  { numeroPedido: '67890', status: 'fechado', dataPedido: '2023-02-15', nomeCliente: 'Maria Oliveira' },
  { numeroPedido: '34567', status: 'aberto', dataPedido: '2023-02-10', nomeCliente: 'Pedro Souza' },
  { numeroPedido: '123', status: 'aberto', dataPedido: '2023-02-10', nomeCliente: 'João da Silva' },
  { numeroPedido: '321', status: 'fechado', dataPedido: '2023-02-10', nomeCliente: 'João da Silva' },
  { numeroPedido: '953', status: 'em produção', dataPedido: '2023-02-10', nomeCliente: 'João da Silva' },
  { numeroPedido: '153', status: 'aberto', dataPedido: '2023-02-10', nomeCliente: 'João da Silva' },
];

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* <Typography variant="h5" align="center">
        Dashboard
      </Typography> */}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ padding: 2, height: 300 }}> {/* Definindo altura fixa */}
            <VelocimetroPedidos />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper sx={{ padding: 2, height: 300 }}> {/* Mesma altura definida aqui */}
            <BarrasPedidosMensais />
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <LinhasTipoProdutos />
        <LinhasTipoProdutos3D />
      </Paper>

      <Paper sx={{ padding: 1, marginTop: 1 }}>
        <Grid container spacing={2}>
          {pedidos.map((pedido, index) => (
            <Grid item key={index} xs={6} md={4}>
              <PedidoStatus
                status={pedido.status}
                numeroPedido={pedido.numeroPedido}
                dataPedido={pedido.dataPedido}
                nomeCliente={pedido.nomeCliente}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
