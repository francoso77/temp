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
  iconSize = { width: 45, height: 45 },
  color = 'primary',
  onClick
}: IconButtonProps) {
  return (
    <>
      <Box sx={{ flexGrow: 1 }} />
      <Tooltip title={tooltipTitle} sx={{ mt: 1 }}>
        <IconButton color={color} onClick={onClick} >
          <Box sx={{ ...iconSize }}>
            {icon}
          </Box>
        </IconButton>
      </Tooltip>
    </>
  )
}