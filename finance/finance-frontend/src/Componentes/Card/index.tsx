import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface CustomCardProps {
  icon: React.ReactNode;
  iconSize?: number | string;
  iconColor?: string;
  title: string;
  subtitle: string;
  description: string;
  bgColor?: string;
  borderRadius?: number | string;
  onClick?: () => void;
  hoverable?: boolean;
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  icon,
  iconSize = 40,
  iconColor = '#616161',
  title,
  subtitle,
  description,
  bgColor = '#ffffff',
  borderRadius = 8,
  onClick,
  hoverable = false,
  titleColor = '#000',
  subtitleColor = '#666',
  descriptionColor = '#333',
}) => {
  const resizedIcon = icon
    ? React.cloneElement(icon as React.ReactElement, {
      sx: { fontSize: iconSize, color: iconColor },
    })
    : null;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%', // garante que o card ocupe toda a altura do grid item
        minHeight: 300,
        maxWidth: 500,
        margin: '0 auto', // centraliza em telas pequenas
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: bgColor,
        borderRadius: borderRadius,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: hoverable ? 3 : 1,
        '&:hover': {
          boxShadow: hoverable ? 6 : 1,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ mb: 1 }}>{resizedIcon}</Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5, color: titleColor }}>
          {title}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, color: subtitleColor }}>
          {subtitle}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2, color: descriptionColor }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
