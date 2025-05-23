import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TitleBarProps {
  title: string;
  highlightIndex?: number; // índice da letra em destaque
  onClose?: () => void;
  backgroundColor?: string;
  textColor?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  highlightIndex = 0,
  onClose,
  backgroundColor = '#1976d2', // cor padrão (azul primário do MUI)
  textColor = '#fff'
}) => {
  const renderTitle = () => {
    return (
      <>
        {title.split('').map((char, index) => (
          <Typography
            key={index}
            component="span"
            sx={{
              fontWeight: highlightIndex === index ? 'bold' : 'normal',
              color: textColor,
              fontSize: '1.25rem'
            }}
          >
            {char}
          </Typography>
        ))}
      </>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor,
        padding: '8px 16px',
        width: '100%',
        borderRadius: '4px 4px 0 0'
      }}
    >
      <Box>{renderTitle()}</Box>
      {onClose && (
        <IconButton onClick={onClose} sx={{ color: textColor }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default TitleBar;
