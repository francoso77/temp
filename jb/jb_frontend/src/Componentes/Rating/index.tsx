import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';

interface HoverColorIntensityRatingProps {
  color: string; // Cor base (ex: '#0000FF', etc.)
  onChange?: (value: number) => void; // Callback para enviar o valor de intensidade selecionado
  dados: {
    [key: string]: string | number | readonly string[] | undefined | any
  }
  field: string
  setState: React.Dispatch<React.SetStateAction<any>>
}

// Função auxiliar para converter cor hexadecimal para RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const HoverColorIntensityRating: React.FC<HoverColorIntensityRatingProps> = ({ color, onChange, dados, field, setState }) => {
  const [intensity, setIntensity] = useState<number>(dados[field]); // Valor de intensidade selecionado
  const [hoverIntensity, setHoverIntensity] = useState<number | null>(null); // Valor de intensidade durante o hover

  const { r, g, b } = hexToRgb(color); // Converter cor para RGB

  // useEffect(() => {
  //   setIntensity(dados[field]); // Atualiza o valor de intensidade inicial quando o componente é montado ou quando `initialIntensity` muda
  // }, [dados[field]]);

  const handleIntensityClick = (value: number) => {
    setIntensity(value);
    setState({ ...dados, [field]: value });
    onChange?.(value);
  };

  const handleMouseEnter = (value: number) => {
    setHoverIntensity(value); // Atualizar a intensidade durante o hover
  };

  const handleMouseLeave = () => {
    setHoverIntensity(null); // Resetar a intensidade do hover quando o mouse sai
  };

  return (
    <Box sx={{ p: 1, mt: 5, textAlign: 'center' }} >
      <Typography gutterBottom>Intensidade da Cor:</Typography>
      <Box display="flex" justifyContent="center">
        {Array.from({ length: 5 }, (_, index) => {
          const currentIntensity = index + 1;
          const isHovered = hoverIntensity !== null ? hoverIntensity >= currentIntensity : intensity >= currentIntensity;
          return (
            <IconButton
              key={index}
              onClick={() => handleIntensityClick(currentIntensity)}
              onMouseEnter={() => handleMouseEnter(currentIntensity)}
              onMouseLeave={handleMouseLeave}
              id={field}
              onChange={(e: any) =>
                setState({ ...dados, [field]: e.target.value })
              }
              sx={{
                color: isHovered
                  ? `rgba(${r}, ${g}, ${b}, ${currentIntensity / 5})`
                  : 'rgba(0, 0, 0, 0.1)', // Ícones desativados quando não estão selecionados ou em hover
              }}
            >
              {/* <Brightness1Icon fontSize="large" /> */}
              <StarTwoToneIcon fontSize="large" />
            </IconButton>
          );
        })}
      </Box>
      <Typography variant="caption" display="block" gutterBottom>
        Intensidade: {intensity}
      </Typography>
    </Box>
  );
};

export default HoverColorIntensityRating;
