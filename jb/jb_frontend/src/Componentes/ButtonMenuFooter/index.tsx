import { Box, IconButton, Tooltip } from '@mui/material';
import React from 'react'
export interface IconButtonProps {
  tooltipTitle: string
  icon: React.ReactNode
  iconSize?: { width: number; height: number }
  color?: 'inherit' | 'primary' | 'secondary' | 'default'
  onClick?: () => void
}

export default function ButtonMenuFooter({
  tooltipTitle,
  icon,
  iconSize = { width: 32, height: 32 },
  color = 'primary',
  onClick
}: IconButtonProps) {
  return (
    <>
      <Box sx={{ flexGrow: 0.5 }} />
      <Tooltip title={tooltipTitle}>
        <IconButton color={color} onClick={onClick}>
          <Box sx={{ ...iconSize }}>
            {icon}
          </Box>
        </IconButton>
      </Tooltip>
    </>
  )
}