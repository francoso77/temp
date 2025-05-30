import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Typography,
} from '@mui/material';

interface CustomCheckboxProps {
  labelAlign?: 'left' | 'right' | 'center';
  tamanhoFonte?: number;
  corFonte?: string;
  label: string;
  field: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
  dados: {
    [key: string]: boolean | any;
  };
  erros?: Record<string, string>;
  colorConfig?: {
    fontColor?: string;
    borderColor?: string;
    backgroundColor?: string;
  };
  disabled?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
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
  disabled = false,
}) => {
  const hasError = !!erros[field];
  const checked = !!dados[field];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setState((prev: typeof dados) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <FormControl
      sx={{
        width: '100%',
        backgroundColor: colorConfig.backgroundColor,
        p: 1,
        borderRadius: 1,
        border: `1px solid ${colorConfig.borderColor}`,
      }}
      error={hasError}
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            sx={{
              color: colorConfig.fontColor,
              '&.Mui-checked': {
                color: colorConfig.fontColor,
              },
            }}
          />
        }
        label={
          <Typography
            variant="body2"
            textAlign={labelAlign}
            sx={{
              fontSize: tamanhoFonte,
              color: corFonte,
            }}
          >
            {label}
          </Typography>
        }
        sx={{
          justifyContent: labelAlign,
          ml: 0,
        }}
      />

      <FormHelperText sx={{ color: hasError ? '#ff5252' : colorConfig.fontColor }}>
        {hasError ? erros[field] : ' '}
      </FormHelperText>
    </FormControl>
  );
};
