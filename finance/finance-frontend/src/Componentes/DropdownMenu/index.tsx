import React, { ReactNode } from "react";
import { Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";

interface DropdownMenuProps {
  children: ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <>{children}</>;
};

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ all: "unset", cursor: "pointer" }}>
      {children}
    </button>
  );
};


interface DropdownMenuContentProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children: ReactNode;
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ anchorEl, onClose, children }) => {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} sx={{ bgcolor: "transparent", color: "inherit" }}>
      {children}
    </Menu>
  );
};

interface DropdownMenuItemProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ onClick, icon, label }) => {
  return (
    <MenuItem onClick={onClick} >
      <ListItemIcon>{icon}</ListItemIcon>
      <Typography>{label}</Typography>
    </MenuItem>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };