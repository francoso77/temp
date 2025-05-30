import React from 'react';
import {
  Box,
  Card,
  Chip,
  IconButton,
  Typography,
  CardContent,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

type AccountType =
  | 'corrente'
  | 'poupanca'
  | 'investimento'
  | 'credito'
  | 'dinheiro'
  | 'outros';

interface AccountCardProps {
  nome: string;
  tipo: AccountType;
  saldoInicial: number;
  saldoAtual: number;
  isPadrao?: boolean;
  corTopo?: string;
  corFundo?: string;
  corFonte?: string;
  corBorda?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getIcon = (tipo: AccountType) => {
  switch (tipo) {
    case 'corrente':
      return <AccountBalanceIcon />;
    case 'poupanca':
      return <SavingsIcon />;
    case 'investimento':
      return <ShowChartIcon />;
    case 'credito':
      return <CreditCardIcon />;
    case 'dinheiro':
      return <MonetizationOnIcon />;
    case 'outros':
    default:
      return <MoreHorizIcon />;
  }
};

export const AccountCard: React.FC<AccountCardProps> = ({
  nome,
  tipo,
  saldoInicial,
  saldoAtual,
  isPadrao = false,
  corTopo = '#81d4fa',
  corFundo = 'transparent',
  corFonte = '#ffffff',
  corBorda = '#cccccc',
  onEdit,
  onDelete,
}) => {
  const formatBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: corFundo,
        border: `1px solid ${corBorda}`,
        color: corFonte,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        minWidth: 280,
      }}
    >
      {/* Faixa superior */}
      <Box sx={{ backgroundColor: corTopo, height: 6 }} />

      {/* Conteúdo */}
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Linha com ícone e nome da conta */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getIcon(tipo)}
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
            {nome}
          </Typography>
          {isPadrao && <Chip size="small" label="Padrão" color="primary" />}
        </Box>

        {/* Nome menor */}
        <Typography variant="body2" sx={{ color: corFonte, opacity: 0.8 }}>
          {nome}
        </Typography>

        {/* Saldo inicial */}
        <Box>
          <Typography variant="caption">Saldo Inicial</Typography>
          <Typography variant="body2">{formatBRL(saldoInicial)}</Typography>
        </Box>

        {/* Saldo atual */}
        <Box>
          <Typography variant="caption">Saldo Atual</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatBRL(saldoAtual)}
          </Typography>
        </Box>
      </CardContent>

      {/* Botões de ação */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          display: 'flex',
          gap: 1,
        }}
      >
        <IconButton size="small" onClick={onEdit} sx={{ color: corFonte }}>
          <Edit fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={onDelete} sx={{ color: corFonte }}>
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
};
