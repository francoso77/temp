import React from 'react';
import { Box, Icon, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


interface TitleBarProps {
  title: string;
  highlightIndex?: number;
  onClose?: () => void;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  textAlign?: 'left' | 'center' | 'right'; // restringe valores válidos
  icon?: React.ReactNode;
}

const TitleBar: React.FC<TitleBarProps> = ({
  title,
  highlightIndex = 0,
  onClose,
  backgroundColor = '#1976d2',
  textColor = '#fff',
  fontSize = '1.2rem',
  textAlign = 'left',
  icon
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
              fontSize: fontSize,
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
        width: '100%',
        borderRadius: '4px 4px 0 0',
        padding: '8px 16px'
      }}
    >
      <Icon sx={{ color: textColor, marginRight: '10px' }} >
        <Box >
          {icon}
        </Box>
      </Icon>
      <Box sx={{ flex: 1, textAlign }}>
        {renderTitle()}
      </Box>
      {onClose && (
        <IconButton onClick={onClose} sx={{ color: textColor }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default TitleBar;
