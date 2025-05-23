import React, { useState } from 'react';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SelectProps,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export interface ColorItem {
  id: string | number;
  name: string;
  color: string;
}

interface ColorSelectListProps {
  label: string;
  items: ColorItem[];
  onChange?: (selected: ColorItem | null) => void;

  // Novas props para estilização
  sx?: SelectProps['sx'];
  borderColor?: string;
  borderWidth?: number;
  menuBgColor?: string;
  valorPadrao?: string | number | '';
  corTexto?: string;
  corIcon?: string;
}

export const ColorSelectList: React.FC<ColorSelectListProps> = ({
  label,
  items,
  onChange,
  sx,
  borderColor = '#3a3a3a',
  borderWidth = '1',
  menuBgColor = '#f9f9f9',
  valorPadrao = '',

  corTexto = '#000000',
  corIcon = '#000000',
}) => {
  const [selectedId, setSelectedId] = useState<string | number | ''>(valorPadrao);

  const handleChange = (event: SelectChangeEvent) => {
    const id = event.target.value;
    setSelectedId(id);
    const selected = items.find(item => item.id.toString() === id);
    onChange?.(selected || null);
  };

  return (
    <Box >
      <Stack direction="row" spacing={1} alignItems="center">
        <Select
          value={selectedId as string}
          placeholder={label}
          onChange={handleChange}
          IconComponent={() => (<SwapVertIcon sx={{ color: corIcon }} />)}
          sx={{
            minWidth: 230,
            maxHeight: 35,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: borderColor,       // cor da borda
              borderWidth: `${borderWidth}px`, // espessura da borda
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: borderColor, // cor ao passar o mouse (hover)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: borderColor, // cor quando está focado
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: menuBgColor,
                color: corTexto,
                p: 0,
                m: 0,
                border: `${borderWidth}px solid ${borderColor}`, // ✅ borda customizada
                borderRadius: 1, // opcional
              },
            },
          }}
        >
          {items.map(item => (
            <MenuItem key={item.id} value={item.id}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 0 }}>
                <Circle sx={{ width: 16, height: 16, color: item.color }} />
                <Typography>{item.name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Box>
  );
};
