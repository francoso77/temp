import React from 'react';
import { Box, Typography, Input } from '@mui/material';

interface ColorPickerProps {
  label?: string;
  dados: { [key: string]: string | number | readonly string[] | undefined | any };
  setState?: React.Dispatch<React.SetStateAction<any>>;
  field: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label = 'Cor', dados, setState, field }) => {
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
    <Box display="flex" alignItems="center" gap={2}>
      <Typography>{label}</Typography>
      <Input
        type="color"
        value={dados[field] || '#000000'}
        onChange={handleChange}
        sx={{ width: 50, padding: 0, minWidth: 0 }}
      />
      <Typography>{dados[field]}</Typography>
    </Box>
  );
};

export default ColorPicker;
