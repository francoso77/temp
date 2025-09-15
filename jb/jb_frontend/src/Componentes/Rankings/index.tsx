import React from 'react';
import { Business, CheckCircleOutline } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import { TopCliente, TopProduto } from '../../Utils/ClsValidacao';
import ClsFormatacao from '../../Utils/ClsFormatacao';

interface RankingsProps {
  topProducts: TopProduto[];
  topClients: TopCliente[];
}
export default function Rankings({ topProducts, topClients }: RankingsProps) {

  const formatacao: ClsFormatacao = new ClsFormatacao();

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
                              R$ {formatacao.currency(product.valorTotal)}
                            </Typography>
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
                              R$ {formatacao.currency(client.valorTotal)}
                            </Typography>
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