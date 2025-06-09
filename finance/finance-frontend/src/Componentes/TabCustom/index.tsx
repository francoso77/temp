import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const CustomTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabList = [
    { label: 'Visão Geral', value: 'overview' },
    { label: 'Receitas', value: 'receita' },
    { label: 'Despesas', value: 'despesa' },
    { label: 'Categorias', value: 'categoria' },
    { label: 'Transações', value: 'transacao' },
  ];

  return (
    <Box sx={{ bgcolor: 'transparent', borderRadius: 2 }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        TabIndicatorProps={{ style: { display: 'none' } }}
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            color: '#fff',
            borderRadius: 1,
            marginRight: 1,

          },
          '& .Mui-selected': {
            backgroundColor: '#050416',
            border: '1px solid #3a3a3a',
          },
          '& .MuiTab-root:not(.Mui-selected)': {
            backgroundColor: '#3a3a3a',
          },
          '& .MuiTab-root:hover': {
            opacity: 0.8,
          },
        }}
      >
        {tabList.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
    </Box>
  );
};

export default CustomTabs;
