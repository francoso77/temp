import React from 'react';
import { Box, Avatar, Typography, Paper } from '@mui/material';

interface StatusPedidoProps {
  numeroPedido: string;
  status: 'Aberto' | 'Em Produção' | 'Fechado';
}

const StatusPedido: React.FC<StatusPedidoProps> = ({ numeroPedido, status }) => {
  // Definindo as cores para cada status
  const statusColor = {
    Aberto: '#4caf50',
    'Em Produção': '#ff9800',
    Fechado: '#f44336',
  };

  return (
    <Paper elevation={2} sx={{ padding: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        sx={{
          bgcolor: statusColor[status],
          width: 56,
          height: 56,
        }}
      >
        {numeroPedido}
      </Avatar>
      <Box>
        <Typography variant="subtitle1">Pedido #{numeroPedido}</Typography>
        <Typography variant="body2" color="textSecondary">
          Status: {status}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatusPedido;
