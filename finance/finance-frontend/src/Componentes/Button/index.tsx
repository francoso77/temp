import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomButtonProps {
  bgColor?: string;
  textColor?: string;
  href?: string;
  onClick?: () => void;
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

  const handleClick = () => {
    if (onClick) onClick();
    if (href) navigate(href);
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      startIcon={iconPosition === 'start' ? icon : undefined}
      endIcon={iconPosition === 'end' ? icon : undefined}
      sx={{
        backgroundColor: bgColor,
        color: textColor,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: bgColor,
          opacity: 0.9,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

