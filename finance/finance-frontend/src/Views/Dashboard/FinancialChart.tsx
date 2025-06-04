import React, { useState } from 'react';
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography, Divider } from '@mui/material';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for Receitas
import MoneyOffIcon from '@mui/icons-material/MoneyOff'; // Icon for Despesas
import AllInclusiveIcon from '@mui/icons-material/AllInclusive'; // Icon for All data
import TodayIcon from '@mui/icons-material/Today'; // Icon for Daily
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Icon for Monthly
import EventNoteIcon from '@mui/icons-material/EventNote'; // Icon for Annual
import { FinancialChartProps, DataPoint } from '../../types/graficoTypes';

/**
 * Componente FinancialChart
 * 
 * Exibe um gráfico financeiro (linhas ou barras) com dados de receitas e despesas.
 * Permite ao usuário alternar o tipo de gráfico, filtrar por tipo de dado (todos, receitas, despesas)
 * e selecionar o período (diário, mensal, anual - este último apenas sinaliza a intenção, 
 * os dados correspondentes devem ser passados via props).
 * 
 * @param {DataPoint[]} data - Array de objetos contendo os dados do gráfico (date, receitas, despesas).
 * @param {string} [backgroundColor='transparent'] - Cor de fundo do container do gráfico.
 * @param {string} [borderColor='transparent'] - Cor da borda do container do gráfico.
 */
const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  backgroundColor = 'transparent',
  borderColor = 'transparent'
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [dataFilter, setDataFilter] = useState<'all' | 'receitas' | 'despesas'>('all');
  const [periodFilter, setPeriodFilter] = useState<'daily' | 'monthly' | 'annual'>('monthly'); // Default or based on initial data

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'line' | 'bar' | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleDataFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newDataFilter: 'all' | 'receitas' | 'despesas' | null,
  ) => {
    if (newDataFilter !== null) {
      setDataFilter(newDataFilter);
    }
  };

  const handlePeriodFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriodFilter: 'daily' | 'monthly' | 'annual' | null,
  ) => {
    if (newPeriodFilter !== null) {
      setPeriodFilter(newPeriodFilter);
      // NOTA IMPORTANTE: A lógica para buscar ou processar os dados com base
      // no período selecionado (Diário, Mensal, Anual) deve ser tratada
      // externamente. Este componente espera receber o array `data` já 
      // correspondente ao período desejado. A mudança de estado aqui serve
      // principalmente para indicar a seleção do usuário e atualizar a UI dos botões.
      console.log(`Período selecionado: ${newPeriodFilter}. Certifique-se de passar os dados corretos via props.`);
    }
  };

  // Estilos para os eixos e grid - cores claras como solicitado
  const axisStyle = { stroke: '#aaaaaa', fontSize: '0.8rem' };
  const gridStyle = { stroke: '#dddddd' }; // Grid com cor clara

  const renderChartElements = () => {
    const commonPropsReceitas = {
      type: 'monotone' as const,
      dataKey: 'receitas',
      stroke: '#4caf50', // Verde para receitas
      fill: '#4caf50',
      name: 'Receitas',
    };
    const commonPropsDespesas = {
      type: 'monotone' as const,
      dataKey: 'despesas',
      stroke: '#f44336', // Vermelho para despesas
      fill: '#f44336',
      name: 'Despesas',
    };

    const lineProps = {
      strokeWidth: 2,
      dot: false,
      activeDot: { r: 6 },
    };

    const barProps = {
      barSize: 20,
    };

    return (
      <>
        {/* Renderiza Receitas se 'all' ou 'receitas' estiver selecionado */}
        {(dataFilter === 'all' || dataFilter === 'receitas') && (
          chartType === 'line' ? (
            <Line {...commonPropsReceitas} {...lineProps} />
          ) : (
            <Bar {...commonPropsReceitas} {...barProps} />
          )
        )}

        {/* Renderiza Despesas se 'all' ou 'despesas' estiver selecionado */}
        {(dataFilter === 'all' || dataFilter === 'despesas') && (
          chartType === 'line' ? (
            <Line {...commonPropsDespesas} {...lineProps} />
          ) : (
            <Bar {...commonPropsDespesas} {...barProps} />
          )
        )}
      </>
    );
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    const chartData = data;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
          {/* Eixos X e Y com cores claras */}
          <XAxis dataKey="date" stroke={axisStyle.stroke} style={{ fontSize: axisStyle.fontSize }} tick={{ fill: axisStyle.stroke }} />
          <YAxis stroke={axisStyle.stroke} style={{ fontSize: axisStyle.fontSize }} tick={{ fill: axisStyle.stroke }} />
          {/* Tooltip ao passar o mouse */}
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(40, 40, 40, 0.85)', border: 'none', borderRadius: '4px', color: '#fff', padding: '8px 12px' }}
            itemStyle={{ color: '#fff', fontSize: '0.9rem' }}
            labelStyle={{ color: '#ddd', marginBottom: '5px', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(204, 204, 204, 0.2)' }}
            formatter={(value: number, name: string) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name]}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />

          {/* Renderiza os elementos do gráfico (Linha ou Barra) */}
          {renderChartElements()}

        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 2,
        backgroundColor: backgroundColor, // Customizável via props
        border: `1px solid ${borderColor}`, // Customizável via props
        borderRadius: '8px'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
        {/* Data Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.5 }}>Mostrar:</Typography>
          <ToggleButtonGroup
            value={dataFilter}
            exclusive
            onChange={handleDataFilterChange}
            aria-label="data filter"
            size="small"
          >
            <ToggleButton value="all" aria-label="show all" sx={{ px: 1.5 }}>
              <AllInclusiveIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="receitas" aria-label="show receitas" sx={{ px: 1.5 }}>
              <AttachMoneyIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="despesas" aria-label="show despesas" sx={{ px: 1.5 }}>
              <MoneyOffIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Period Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.5 }}>Período:</Typography>
          <ToggleButtonGroup
            value={periodFilter}
            exclusive
            onChange={handlePeriodFilterChange}
            aria-label="period filter"
            size="small"
          >
            <ToggleButton value="daily" aria-label="daily view" sx={{ px: 1.5 }}>
              <TodayIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="monthly" aria-label="monthly view" sx={{ px: 1.5 }}>
              <CalendarMonthIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="annual" aria-label="annual view" sx={{ px: 1.5 }}>
              <EventNoteIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Chart Type Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.5 }}>Tipo:</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
            size="small"
          >
            <ToggleButton value="line" aria-label="line chart" sx={{ px: 1.5 }}>
              <ShowChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="bar" aria-label="bar chart" sx={{ px: 1.5 }}>
              <BarChartIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Divider sx={{ marginBottom: 2 }} />
      {renderChart()}
    </Paper>
  );
};

export default FinancialChart;

