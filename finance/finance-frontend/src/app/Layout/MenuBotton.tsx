import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CategoryIcon from "@mui/icons-material/Category";
import BusinessIcon from "@mui/icons-material/Business";
import BarChartIcon from "@mui/icons-material/BarChart";

const menuItems = [
  { label: "Dashboard", value: "dashboard", icon: <DashboardIcon /> },
  { label: "Contas", value: "contas", icon: <AccountBalanceIcon /> },
  { label: "Transações", value: "transacoes", icon: <SyncAltIcon /> },
  { label: "Categorias", value: "categorias", icon: <CategoryIcon /> },
  { label: "Empresas", value: "empresas", icon: <BusinessIcon /> },
  { label: "Relatórios", value: "relatorios", icon: <BarChartIcon /> },
];

interface Props {
  onSelect: (value: string) => void;
}

const BottomResponsiveMenu: React.FC<Props> = ({ onSelect }) => {
  const [value, setValue] = React.useState("dashboard");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSelect = (newValue: string) => {
    setValue(newValue);
    onSelect(newValue);
  };

  if (isMobile) {
    return (
      <Paper
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "2rem",
          boxShadow: 6,
          zIndex: 1300,
          backgroundColor: theme.palette.background.paper,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => handleSelect(newValue)}
          sx={{ borderRadius: "2rem", px: 2 }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    );
  }

  // Versão desktop: drawer lateral
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 80,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 80,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: "none",
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.value}
            selected={value === item.value}
            onClick={() => handleSelect(item.value)}
            sx={{ justifyContent: "center", py: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 0, color: value === item.value ? theme.palette.primary.main : "inherit" }}>
              {item.icon}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default BottomResponsiveMenu;
