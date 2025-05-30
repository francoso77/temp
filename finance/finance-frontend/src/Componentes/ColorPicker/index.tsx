import React from 'react';
import { Box, Typography, Input } from '@mui/material';

interface ColorPickerProps {
  label?: string;
  dados: {
    [key: string]: string | number | readonly string[] | undefined | any
  };
  setState?: React.Dispatch<React.SetStateAction<any>>;
  field: string;
  corFonte?: string;
  disabled?: boolean
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label = 'Cor', dados, setState, field, corFonte = '#fff', disabled = false }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    if (setState) {
      setState((prev: typeof dados) => ({
        ...prev,
        [field]: newColor,
      }));
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
      <Typography sx={{ color: corFonte, ml: 1 }}>{label}</Typography>
      <Input
        type="color"
        value={dados[field] || '#b46d6d'}
        onChange={handleChange}
        sx={{ width: 50, padding: 0, minWidth: 0, }}
        disabled={disabled}
      />
      <Typography sx={{ color: corFonte }}>{dados[field]}</Typography>
    </Box>
  );
};

export default ColorPicker;
