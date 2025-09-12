import React from 'react';
import { Business, CheckCircleOutline, TrendingUp } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import { TopCliente, TopProduto } from '../../Utils/ClsValidacao';

// const topProducts: any[] = [
//   { name: "Produto 1", vendas: 100, valor: 100 },
//   { name: "Produto 2", vendas: 80, valor: 90 },
//   { name: "Produto 3", vendas: 60, valor: 80 },
//   { name: "Produto 4", vendas: 40, valor: 70 },
//   { name: "Produto 5", vendas: 20, valor: 60 },
// ];

// const topClients: any[] = [
//   { name: "Cliente 1", vendas: 100, valor: 100 },
//   { name: "Cliente 2", vendas: 80, valor: 90 },
//   { name: "Cliente 3", vendas: 60, valor: 80 },
//   { name: "Cliente 4", vendas: 40, valor: 70 },
//   { name: "Cliente 5", vendas: 20, valor: 60 },
// ]


interface RankingsProps {
  topProducts: TopProduto[];
  topClients: TopCliente[];
}
export default function Rankings({ topProducts, topClients }: RankingsProps) {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CheckCircleOutline color="primary" />
                  <Typography variant="h5">Produtos Mais Vendidos</Typography>
                </Box>
                <Stack spacing={2}>
                  {topProducts.map((product, index) => (
                    <Paper key={product.nomeProduto} sx={{ p: 2 }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width={40}
                            height={40}
                            borderRadius="50%"
                            bgcolor="primary.main"
                            color="primary.contrastText"
                            fontWeight="bold"
                          >
                            {index + 1}
                          </Box>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {product.nomeProduto}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.qtdTotal} unidades
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Box textAlign="right">
                            <Typography variant="h6" fontWeight="bold">
                              R$ {product.valorTotal.toLocaleString("pt-BR")}
                            </Typography>
                            {/* <Box display="flex" alignItems="center" gap={0.5}>
                              <TrendingUp
                                fontSize="small"
                                color={product.crescimento > 0 ? "success" : "error"}
                                sx={{
                                  transform: product.crescimento < 0 ? "rotate(180deg)" : "none",
                                }}
                              />
                              <Typography
                                variant="body2"
                                color={product.crescimento > 0 ? "success.main" : "error.main"}
                                fontWeight="medium"
                              >
                                {product.crescimento > 0 ? "+" : ""}
                                {product.crescimento}%
                              </Typography>
                            </Box> */}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Business color="primary" />
                  <Typography variant="h5">Clientes que Mais Compraram</Typography>
                </Box>
                <Stack spacing={2}>
                  {topClients.map((client, index) => (
                    <Paper key={client.nomeCliente} sx={{ p: 2 }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Avatar>{client.nomeCliente.charAt(0)}</Avatar>
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {client.nomeCliente}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {client.qtdPedidos} pedidos
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Box textAlign="right">
                            <Typography variant="h6" fontWeight="bold">
                              R$ {client.valorTotal.toLocaleString("pt-BR")}
                            </Typography>
                            {/* <Typography variant="body2" color="text.secondary">
                              Último: {client.ultimoPedido}
                            </Typography> */}
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}