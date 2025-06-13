import React, { useState, useEffect } from 'react';
import { FormControl, TextField, TextFieldProps, Typography } from '@mui/material';
import Condicional from '../Condicional/Condicional';
import { useTheme } from "@mui/material";

interface CurrencyTextFieldProps {
  posicaoLabel?: 'top' | 'bottom';
  labelAlign?: 'left' | 'right' | 'center';
  tamanhoFonte?: number;
  corFonte?: string;
  label: string;
  field: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
  dados: {
    [key: string]: string | number | readonly string[] | undefined | any
  };
  erros?: Record<string, string>;
  colorConfig?: {
    fontColor?: string;
    borderColor?: string;
    backgroundColor?: string;
  };
  textFieldProps?: TextFieldProps;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> | undefined;
  onFocus?: (v: any) => void
}

export const CurrencyTextField: React.FC<CurrencyTextFieldProps> = ({
  posicaoLabel = 'top',
  labelAlign = 'left',
  tamanhoFonte = 16,
  corFonte = '#ffffff',
  label,
  field,
  setState,
  dados,
  erros = {},
  colorConfig = {
    fontColor: '#ffffff',
    borderColor: '#3a3a3a',
    backgroundColor: 'transparent',
  },
  textFieldProps,
  onKeyDown,
  onFocus
}) => {
  const [input, setInput] = useState<string>(() =>
    typeof dados[field] === 'number'
      ? formatCurrency(dados[field] as number)
      : ''
  );

  const hasError = !!erros[field];
  const theme = useTheme()

  useEffect(() => {
    // Atualiza input se o valor mudar externamente
    if (typeof dados[field] === 'number') {
      setInput(formatCurrency(dados[field] as number));
    }
  }, [dados[field]]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyDigitsAndComma = raw.replace(/[^\d,]/g, '');
    setInput(onlyDigitsAndComma);
  };

  const handleBlur = () => {
    const numericValue = parseCurrency(input);
    const formatted = formatCurrency(numericValue);
    setInput(formatted);

    setState((prev: typeof dados) => ({
      ...prev,
      [field]: numericValue, // ← SALVA COMO NÚMERO
    }));
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <Condicional condicao={posicaoLabel === 'top'}>

        <Typography
          variant="body2"
          textAlign={labelAlign}
          sx={{
            mt:
              theme && theme.inputs && theme.inputs.marginTop
                ? theme.inputs.marginTop
                : 0,
            fontSize: tamanhoFonte,
            color: corFonte
          }}
        >
          {label}
        </Typography>
      </Condicional>
      <TextField
        fullWidth
        value={input}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        variant="outlined"
        error={hasError}
        helperText={hasError ? erros[field] : ' '}
        InputProps={{
          style: {
            color: colorConfig.fontColor,
            backgroundColor: colorConfig.backgroundColor,
          },
        }}
        InputLabelProps={{
          style: {
            color: colorConfig.fontColor,
          },
        }}
        size='small'
        sx={{
          //width: '100%',

          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colorConfig.borderColor,
            },
            '&:hover fieldset': {
              borderColor: colorConfig.borderColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: colorConfig.borderColor,
            },
            backgroundColor: colorConfig.backgroundColor,
            color: colorConfig.fontColor,
          },
          '& .MuiFormHelperText-root': {
            color: hasError ? '#ff5252' : colorConfig.fontColor,
          },
        }}
        {...textFieldProps}
      />
    </FormControl>
  );
};

// Formata número como moeda BR
function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

// Converte string tipo "10500,33" em number
function parseCurrency(value: string): number {
  const clean = value.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  return parseFloat(clean) || 0;
}
