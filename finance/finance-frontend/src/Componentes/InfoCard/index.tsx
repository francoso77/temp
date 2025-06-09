import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { SxProps } from '@mui/system';

type InfoCardProps = {
  titulo: string;
  icone?: React.ReactNode;
  valor: number;
  formatoValor: 'numero' | 'moeda';
  texto?: string;
  corFundo?: string;
  corBorda?: string;
  espessuraBorda?: number;
};

function ajustarCorFundo(cor: string, fator: number = 0.2): string {
  const hex = cor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const lighten = (c: number) => Math.min(255, Math.floor(c + (255 - c) * fator));
  return `rgb(${lighten(r)}, ${lighten(g)}, ${lighten(b)})`;
}

const InfoCard: React.FC<InfoCardProps> = ({
  titulo,
  icone,
  valor,
  formatoValor,
  texto,
  corFundo = '#81d4fa',
  corBorda = '#ffffff',
  espessuraBorda = 1,
}) => {
  const valorFormatado =
    formatoValor === 'moeda'
      ? valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : valor.toLocaleString('pt-BR');

  const corIcone = ajustarCorFundo(corFundo, 0.3);

  const containerStyle: SxProps = {
    backgroundColor: corFundo,
    color: '#fff',
    borderRadius: 2,
    padding: 2,
    border: `${espessuraBorda}px solid ${corBorda}`,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Card sx={containerStyle} elevation={3}>
      {/* Linha do título com ícone na direita */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: 14 }}>{titulo}</Typography>
        <Box color={corIcone}>{icone}</Box>
      </Box>

      {/* Valor principal */}
      <Typography sx={{ fontSize: 24, mt: 1, fontWeight: 'bold' }}>
        {valorFormatado}
      </Typography>

      {/* Texto pequeno abaixo */}
      <Typography sx={{ fontSize: 12, mt: 0.5 }}>{texto}</Typography>
    </Card>
  );
};

export default InfoCard;
