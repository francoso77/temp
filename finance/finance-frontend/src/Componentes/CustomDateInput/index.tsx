import React from 'react';
import InputMask from 'react-input-mask';
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

interface CustomDateInputProps {
  label: string;
  field: string;
  setState: React.Dispatch<React.SetStateAction<any>>;
  dados: {
    [key: string]: string | any;
  };
  erros?: Record<string, string>;
  colorConfig?: {
    fontColor?: string;
    borderColor?: string;
    backgroundColor?: string;
  };
  disabled?: boolean;
}

export const CustomDateInput: React.FC<CustomDateInputProps> = ({
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
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
      <Typography
        variant="body2"
        sx={{ fontSize: 16, color: colorConfig.fontColor, mb: 0.5 }}
      >
        {label}
      </Typography>

      <InputMask
        mask="99/99/9999"
        value={dados[field] || ''}
        onChange={handleChange}
        disabled={disabled}
      >
        {(inputProps: any) => (
          <OutlinedInput
            {...inputProps}
            fullWidth
            placeholder="dd/mm/aaaa"
            endAdornment={
              <InputAdornment position="end">
                <CalendarToday sx={{ color: colorConfig.fontColor }} />
              </InputAdornment>
            }
            sx={{
              color: colorConfig.fontColor,
              '& fieldset': {
                borderColor: colorConfig.borderColor,
              },
              '&:hover fieldset': {
                borderColor: colorConfig.borderColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: colorConfig.borderColor,
              },
            }}
          />
        )}
      </InputMask>

      <FormHelperText sx={{ color: hasError ? '#ff5252' : colorConfig.fontColor }}>
        {hasError ? erros[field] : ' '}
      </FormHelperText>
    </FormControl>
  );
};
