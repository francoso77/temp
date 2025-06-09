import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, ListItemIcon, ListItemText } from '@mui/material';
import CustomButton from '../Button';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';


interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface PropsInterface {
  nameButton?: string;
  menuItems: MenuItemProps[];
  textColor?: string;
  backgroundColor?: string;
  hoverColor?: string;
}

export default function ButtonMenu({
  nameButton = 'Menu',
  menuItems,
  textColor = '#fff',
  backgroundColor = 'transparent',
  hoverColor = '#444',
}: PropsInterface) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <CustomButton
        onClick={handleClick}
        bgColor="transparent"
        textColor="#fff"
        sx={{ border: '1px solid #3a3a3a', mr: 2 }}
        iconPosition="start"
        icon={<ArchiveTwoToneIcon />}
      >
        {nameButton}
      </CustomButton>
      <Menu
        id="custom-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor,
            color: textColor,
            border: '1px solid #3a3a3a',
            borderRadius: '4px',
            mt: 1,
          },
        }}
        MenuListProps={{
          disablePadding: false,
        }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
            sx={{
              '&:hover': {
                backgroundColor: hoverColor,
              },
            }}
          >
            <ListItemIcon sx={{ color: textColor }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ sx: { color: textColor } }}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
