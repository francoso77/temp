import React, { useState } from 'react';
import { Box, Paper, ToggleButton, ToggleButtonGroup, Typography, Divider, Tooltip as MuiTooltip } from '@mui/material'; // Renamed Tooltip to avoid conflict
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'; // Renamed Tooltip from recharts
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { FinancialChartProps } from '../../types/graficoTypes';

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
 * @param {Title} string - título a ser atribuido ao gráfico.
 */
const FinancialChart: React.FC<FinancialChartProps> = ({
  data,
  backgroundColor = 'transparent',
  borderColor = 'transparent',
  title = 'Gráfico Financeiro',
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
  const [dataFilter, setDataFilter] = useState<'all' | 'receitas' | 'despesas'>('all');
  const [periodFilter, setPeriodFilter] = useState<'daily' | 'monthly' | 'annual'>('monthly');

  // --- Handlers --- 
  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newChartType: 'line' | 'bar' | null) => {
    if (newChartType !== null) setChartType(newChartType);
  };
  const handleDataFilterChange = (event: React.MouseEvent<HTMLElement>, newDataFilter: 'all' | 'receitas' | 'despesas' | null) => {
    if (newDataFilter !== null) setDataFilter(newDataFilter);
  };
  const handlePeriodFilterChange = (event: React.MouseEvent<HTMLElement>, newPeriodFilter: 'daily' | 'monthly' | 'annual' | null) => {
    if (newPeriodFilter !== null) {
      setPeriodFilter(newPeriodFilter);
      console.log(`Período selecionado: ${newPeriodFilter}. Certifique-se de passar os dados corretos via props.`);
    }
  };

  // --- Styles --- 
  const axisStyle = { stroke: '#aaaaaa', fontSize: '0.8rem' };
  const gridStyle = { stroke: '#dddddd' };
  const lightTextColor = '#e0e0e0'; // Cor clara para textos
  const buttonBorderColor = '#3a3a3a'; // Cor da borda dos botões solicitada

  // --- Render Chart Elements --- 
  const renderChartElements = () => {
    const commonPropsReceitas = { type: 'monotone' as const, dataKey: 'receitas', stroke: '#4caf50', fill: '#4caf50', name: 'Receitas' };
    const commonPropsDespesas = { type: 'monotone' as const, dataKey: 'despesas', stroke: '#f44336', fill: '#f44336', name: 'Despesas' };
    const qtdProps = { type: 'monotone' as const, dataKey: 'qtd', stroke: '#2196f3', fill: '#2196f3', name: 'Produção' };
    const lineProps = { strokeWidth: 2, dot: false, activeDot: { r: 6 } };
    const barProps = { barSize: 20 };

    return (
      <>
        {chartType === 'line' ? (
          <>
            {(dataFilter === 'all' || dataFilter === 'receitas') && <Line {...commonPropsReceitas} {...lineProps} />}
            {(dataFilter === 'all' || dataFilter === 'despesas') && <Line {...commonPropsDespesas} {...lineProps} />}
            {dataFilter === 'receitas' && <Line {...qtdProps} {...lineProps} />}
          </>
        ) : (
          <>
            {(dataFilter === 'all' || dataFilter === 'receitas') && <Bar {...commonPropsReceitas} {...barProps} />}
            {(dataFilter === 'all' || dataFilter === 'despesas') && <Bar {...commonPropsDespesas} {...barProps} />}
            {dataFilter === 'receitas' && <Bar {...qtdProps} {...barProps} />}
          </>
        )}
      </>
    );
  };

  // --- Render Chart --- 
  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} />
          <XAxis dataKey="date" stroke={axisStyle.stroke} style={{ fontSize: axisStyle.fontSize }} tick={{ fill: axisStyle.stroke }} />
          <YAxis stroke={axisStyle.stroke} style={{ fontSize: axisStyle.fontSize }} tick={{ fill: axisStyle.stroke }} />
          <RechartsTooltip
            contentStyle={{ backgroundColor: 'rgba(40, 40, 40, 0.85)', border: 'none', borderRadius: '4px', color: '#fff', padding: '8px 12px' }}
            itemStyle={{ color: '#fff', fontSize: '0.9rem' }}
            labelStyle={{ color: '#ddd', marginBottom: '5px', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(204, 204, 204, 0.2)' }}
            formatter={(value: number, name: string) => {
              if (name === 'Qtd') return [`${value}`, 'Produção'];
              return [`${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
            }}

          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {renderChartElements()}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  // --- Button Group Styles --- 
  const toggleButtonGroupSx = {
    '& .MuiToggleButtonGroup-grouped': {
      borderColor: buttonBorderColor, // Apply border color to individual buttons in the group
      color: lightTextColor, // Ensure button icon/text color is light
      '&:not(:first-of-type)': {
        borderLeftColor: buttonBorderColor, // Ensure left border has the color too
      },
      '&.Mui-selected': {
        color: '#ffffff', // Brighter text when selected
        backgroundColor: 'rgba(58, 58, 58, 0.5)', // Darker background when selected for contrast
        borderColor: buttonBorderColor, // Keep border color when selected
        '&:hover': {
          backgroundColor: 'rgba(58, 58, 58, 0.7)', // Slightly lighter on hover when selected
        }
      },
      '&:hover': {
        backgroundColor: 'rgba(58, 58, 58, 0.3)', // Hover effect for non-selected buttons
        borderColor: buttonBorderColor, // Keep border color on hover
      }
    }
  };

  // --- Main Component Return --- 
  return (
    <Paper
      elevation={0}
      sx={{
        padding: 1,
        backgroundColor: backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px'
      }}
    >
      {/* Title Added Here */}
      <Typography variant="h6" component="h2" sx={{ color: lightTextColor, marginBottom: 2, textAlign: 'left' }}>
        {title}
      </Typography>

      {/* Control Buttons Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
        {/* Data Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: lightTextColor, mr: 0.5 }}>Mostrar:</Typography>
          <ToggleButtonGroup
            value={dataFilter}
            exclusive
            onChange={handleDataFilterChange}
            aria-label="Filtrar dados"
            size="small"
            sx={toggleButtonGroupSx} // Apply shared styles
          >
            <MuiTooltip title="Mostrar Todos">
              <ToggleButton value="all" aria-label="Mostrar tudo" sx={{ px: 1.5 }}>
                <AllInclusiveIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
            <MuiTooltip title="Mostrar Receitas">
              <ToggleButton value="receitas" aria-label="Mostrar receitas" sx={{ px: 1.5 }}>
                <AttachMoneyIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
            <MuiTooltip title="Mostrar Despesas">
              <ToggleButton value="despesas" aria-label="Mostrar despesas" sx={{ px: 1.5 }}>
                <MoneyOffIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
          </ToggleButtonGroup>
        </Box>
        {/* Period Filter Buttons */}
        {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: lightTextColor, mr: 0.5 }}>Período:</Typography>
          <ToggleButtonGroup
            value={periodFilter}
            exclusive
            onChange={handlePeriodFilterChange}
            aria-label="Filtrar período"
            size="small"
            sx={toggleButtonGroupSx} // Apply shared styles
          >
            <MuiTooltip title="Visão Diária">
              <ToggleButton value="daily" aria-label="Visão diária" sx={{ px: 1.5 }}>
                <TodayIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
            <MuiTooltip title="Visão Mensal">
              <ToggleButton value="monthly" aria-label="Visão mensal" sx={{ px: 1.5 }}>
                <CalendarMonthIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
            <MuiTooltip title="Visão Anual">
              <ToggleButton value="annual" aria-label="Visão anual" sx={{ px: 1.5 }}>
                <EventNoteIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
          </ToggleButtonGroup>
        </Box> */}

        {/* Chart Type Buttons */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: lightTextColor, mr: 0.5 }}>Tipo:</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="Tipo de gráfico"
            size="small"
            sx={toggleButtonGroupSx} // Apply shared styles
          >
            <MuiTooltip title="Gráfico de Linha">
              <ToggleButton value="line" aria-label="Gráfico de linha" sx={{ px: 1.5 }}>
                <ShowChartIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
            <MuiTooltip title="Gráfico de Barras">
              <ToggleButton value="bar" aria-label="Gráfico de barras" sx={{ px: 1.5 }}>
                <BarChartIcon fontSize="small" />
              </ToggleButton>
            </MuiTooltip>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Divider sx={{ marginBottom: 2, borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      {renderChart()}
    </Paper>
  );
};

export default FinancialChart;

