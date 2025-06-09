import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import OverviewComponent from './overviewComponent';
import ReceitaComponent from './receitaComponent';
import DespesaComponent from './despesaComponent';
import CategoriaComponent from './categoriaComponent';
import TransacaoComponent from './transacaoComponent';
import { DataPoint } from '../../types/graficoTypes';

interface TabProps {
  titleOverview?: string;
  titleReceita?: string;
  titleDespesa?: string;
  titleCategoria?: string;
  titleTransacao?: string;
  dataOverview?: DataPoint[];

}

const CustomTabs = ({
  titleOverview = 'Visão Geral', 
  titleReceita, 
  titleDespesa, 
  titleCategoria, 
  titleTransacao, 
  dataOverview = []
}: TabProps) => {
  
  const [activeTab, setActiveTab] = useState('overview');

  const tabList = [
    { label: 'Visão Geral', value: 'overview' },
    { label: 'Receitas', value: 'receita' },
    { label: 'Despesas', value: 'despesa' },
    { label: 'Categorias', value: 'categoria' },
    { label: 'Transações', value: 'transacao' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewComponent title={titleOverview} data={dataOverview} />;
      case 'receita':
        return <ReceitaComponent data={['Venda A', 'Venda B']} />;
      case 'despesa':
        return <DespesaComponent tipo="mensal" />;
      case 'categoria':
        return <CategoriaComponent categorias={['Alimentação', 'Transporte']} />;
      case 'transacao':
        return <TransacaoComponent filtro={{ status: 'ativo' }} />;
      default:
        return null;
    }
  };

  return (
    <>
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
              fontSize: '0.75rem', // Tamanho da fonte reduzido
              padding: '4px 10px', // Menor padding interno
              minHeight: '32px', // Altura mínima menor
              minWidth: '80px', // Largura mínima ajustável
              color: '#fff',
              borderRadius: 1,
              marginRight: 0.5, // Espaçamento entre abas
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
      <Box sx={{ mt: 2 }}>
        {renderTabContent()}
      </Box>
    </>
  );
};

export default CustomTabs;
