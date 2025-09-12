import { AttachMoney, CalendarToday, Factory, TrendingUp, BarChart as BarChartIcon, } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';

export default function Comparation() {
  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <CalendarToday color="primary" />
              <Typography variant="h5">Comparativo Histórico - Junho 2024 vs Junho 2023</Typography>
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
                    R$ 487.500
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    vs R$ 425.000 (2023)
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <TrendingUp color="success" />
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      +14.7%
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
                    198
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    vs 185 (2023)
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <TrendingUp color="success" />
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      +7.0%
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
                    R$ 2.461
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    vs R$ 2.297 (2023)
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <TrendingUp color="success" />
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      +7.1%
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