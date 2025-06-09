import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomButtonProps {
  bgColor?: string;
  textColor?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  bgColor = '#1976d2',
  textColor = '#ffffff',
  href,
  onClick,
  icon,
  iconPosition = 'start',
  children,
  sx,
}) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event); // ✅ passa o evento corretamente
    if (href) navigate(href);
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      startIcon={iconPosition === 'start' ? icon : undefined}
      endIcon={iconPosition === 'end' ? icon : undefined}
      sx={{
        zIndex: 1,
        backgroundColor: bgColor,
        color: textColor,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: bgColor,
          opacity: 0.5,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

