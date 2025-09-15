import { AttachMoney, CalendarToday, Factory, TrendingUp, BarChart as BarChartIcon, TrendingDown, } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import ClsFormatacao from '../../Utils/ClsFormatacao';
import Condicional from '../Condicional/Condicional';

interface ComparationProps {
  idPeriodo: number
  totalVendas: number
  totalVendasAnterior: number
  ticket: number
  ticketAnterior: number
  totalPedidos: number
  totalPedidosAnterior: number
}
export default function Comparation({ idPeriodo, totalVendas, totalVendasAnterior, ticket, ticketAnterior, totalPedidos, totalPedidosAnterior }: ComparationProps) {

  const formatacao: ClsFormatacao = new ClsFormatacao();

  let periodoAtual: string = '';
  let periodoAnterior: string = '';

  switch (idPeriodo) {
    case 1:
      periodoAtual = 'Mês Atual';
      periodoAnterior = 'Mês Anterior';
      break;
    case 2:
      periodoAtual = 'Último Mês';
      periodoAnterior = 'Penúltimo Mês';
      break;
    case 3:
      periodoAtual = 'Últimos 3 Meses';
      periodoAnterior = '3 Meses Anteriores';
      break;
    case 4:
      periodoAtual = 'Últimos 6 Meses';
      periodoAnterior = '6 Meses Anteriores';
      break;
    case 5:
      periodoAtual = 'Ano Atual';
      periodoAnterior = 'Ano Anterior';
      break;
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <CalendarToday color="primary" />
              <Typography variant="h5">Comparativo Histórico - {periodoAtual} vs {periodoAnterior}</Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <AttachMoney color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Vendas Totais
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>
                    R$ {formatacao.currency(totalVendas)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    vs R$ {formatacao.currency(totalVendasAnterior)} ({periodoAnterior})
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <Condicional condicao={totalVendas > totalVendasAnterior}>
                      <TrendingUp color="success" />
                    </Condicional>
                    <Condicional condicao={totalVendas < totalVendasAnterior}>
                      <TrendingDown color="error" />
                    </Condicional>
                    <Typography variant="h6" color={totalVendas > totalVendasAnterior ? "success.main" : "error.main"} fontWeight="bold">
                      {totalVendasAnterior === 0 ? '-' : formatacao.currency((totalVendas / totalVendasAnterior) * 100 - 100)} %
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <Factory color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Total de Pedidos
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>
                    {formatacao.numeroPadrao(totalPedidos)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    vs {formatacao.numeroPadrao(totalPedidosAnterior)} ({periodoAnterior})
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <Condicional condicao={totalPedidos > totalPedidosAnterior}>
                      <TrendingUp color="success" />
                    </Condicional>
                    <Condicional condicao={totalPedidos < totalPedidosAnterior}>
                      <TrendingDown color="error" />
                    </Condicional>
                    <Typography variant="h6" color={totalPedidos > totalPedidosAnterior ? "success.main" : "error.main"} fontWeight="bold">
                      {totalPedidosAnterior === 0 ? '-' : formatacao.currency((totalPedidos / totalPedidosAnterior) * 100 - 100)} %
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: "center" }}>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <BarChartIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Ticket Médio
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>
                    R$ {formatacao.currency(ticket)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    vs R$ {formatacao.currency(ticketAnterior)} ({periodoAnterior})
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <Condicional condicao={ticket > ticketAnterior}>
                      <TrendingUp color="success" />
                    </Condicional>
                    <Condicional condicao={ticket < ticketAnterior}>
                      <TrendingDown color="error" />
                    </Condicional>
                    <Typography variant="h6" color={ticket > ticketAnterior ? "success.main" : "error.main"} fontWeight="bold">
                      {ticketAnterior === 0 ? "-" : formatacao.currency((ticket / ticketAnterior) * 100 - 100)} %
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

    </>
  )
} 