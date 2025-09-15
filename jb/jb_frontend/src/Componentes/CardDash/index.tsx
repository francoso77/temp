import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import React from 'react';
import Condicional from '../Condicional/Condicional';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface CardDashProps {
  titulo: string;
  vrAtual: number;
  vrAnterior?: number;
  chip?: string;
  corIcone?: "primary" | "secondary" | "error" | "warning" | "info" | "success"; // cor do ícone e do chip
  IconePrinicipal: React.ElementType; // ex: Schedule
  IconeSecundario?: boolean;
}


export default function CardDash({
  titulo,
  vrAtual,
  vrAnterior = 0,
  chip,
  corIcone = "primary",
  IconePrinicipal,
  IconeSecundario = false,
}: CardDashProps) {
  return (
    <>
      <Card sx={{ mr: 1, mt: 1 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Typography variant="body2" color="text.secondary">
              {titulo}
            </Typography>
            <IconePrinicipal color={corIcone} />
          </Box>
          <Typography variant="h3" component="div" fontWeight="bold" mb={1}>
            <Condicional condicao={chip !== ""}>
              {vrAtual}
            </Condicional>
            <Condicional condicao={chip === ""}>
              R$ {vrAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Condicional>
          </Typography>
          <Condicional condicao={chip !== ""}>
            <Chip label={chip} size="small" color={corIcone} />
          </Condicional>
          <Condicional condicao={chip === ""}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Condicional condicao={IconeSecundario && vrAtual > vrAnterior}>
                <TrendingUp color={'success'} fontSize="small" />
              </Condicional>
              <Condicional condicao={IconeSecundario && vrAtual < vrAnterior}>
                <TrendingDown color={'error'} fontSize="small" />
              </Condicional>
              <Condicional condicao={vrAnterior > 0}>
                <Typography variant="body2" color={vrAtual > vrAnterior ? "success.main" : "error"} fontWeight="medium">
                  {
                    (vrAtual > vrAnterior) ?
                      ((vrAtual / vrAnterior) * 100 - 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : ((vrAtual / vrAnterior) * 100 - 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }% vs Período Anterior
                </Typography>
              </Condicional>
            </Box>
          </Condicional>
        </CardContent>
      </Card>
    </>
  );
}