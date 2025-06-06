import React, { useState } from 'react';
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for Receitas
import MoneyOffIcon from '@mui/icons-material/MoneyOff'; // Icon for Despesas
import { CategoryPieChartProps } from '../../types/graficoTypes';

/**
 * Componente CategoryPieChart
 * 
 * Exibe um gráfico de pizza mostrando a distribuição de valores por categoria.
 * Permite filtrar entre categorias de Receitas e Despesas.
 * Utiliza cores definidas por categoria, possui estilo claro e exibe rótulos nas fatias.
 * 
 * @param {CategoryDataPoint[]} data - Array de objetos contendo os dados das categorias (name, value, color, type).
 */
const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const [dataType, setDataType] = useState<'receita' | 'despesa'>('despesa'); // Default to despesas

  const handleDataTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newDataType: 'receita' | 'despesa' | null,
  ) => {
    if (newDataType !== null) {
      setDataType(newDataType);
    }
  };

  // Filter data based on the selected type (receita/despesa)
  const filteredData = data.filter(item => item.type === dataType);

  // Style for labels and legend (clear font color)
  const textStyle = { color: '#cccccc', fontSize: '0.9rem' };
  const lightBorderColor = "#3a3a3a";

  // Custom Tooltip Content
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{
          backgroundColor: 'rgba(40, 40, 40, 0.85)',
          border: 'none',
          borderRadius: '4px',
          color: '#fff',
          padding: '8px 12px',
          fontSize: '0.9rem'
        }}>
          <Typography sx={{ color: '#ddd', marginBottom: '3px', fontWeight: 'bold' }}>{data.name}</Typography>
          <Typography>{`Valor: R$ ${data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom Label for Pie Slices - Shows Name and Value (R$)
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
    // Adjust label positioning: further out for better readability with two lines
    const radius = outerRadius * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const valueFormatted = `R$${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;

    // Only render label if percent is large enough
    if (percent < 0.04) { // Slightly increased threshold: 4%
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff" // White text for labels
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="0.75rem" // Slightly smaller font size for two lines
        fontWeight="bold"
        // Add a subtle stroke for better contrast
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.6)', strokeWidth: '2px', strokeLinecap: 'butt', strokeLinejoin: 'miter' }}
      >
        {/* Display Name on first line */}
        <tspan x={x} dy="-0.6em">{name}</tspan>
        {/* Display Value on second line */}
        <tspan x={x} dy="1.2em">{valueFormatted}</tspan>
      </text>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 5,
        width: '100%',
        backgroundColor: 'transparent', // Transparent background
        border: `1px solid ${lightBorderColor}`, // Clear border
        borderRadius: '8px',
        color: textStyle.color, // Set default text color to clear

      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" component="h2" sx={{ color: textStyle.color }}>
          Distribuição por Categoria
        </Typography>

        {/* Filter Buttons */}
        <ToggleButtonGroup
          value={dataType}
          exclusive
          onChange={handleDataTypeChange}
          aria-label="Tipo de dado"
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderColor: lightBorderColor,
              color: textStyle.color,
              '&.Mui-selected': {
                color: '#ffffff',
                backgroundColor: 'rgba(204, 204, 204, 0.2)',
              },
              '&:hover': {
                backgroundColor: 'rgba(204, 204, 204, 0.1)',
              }
            }
          }}
        >
          <ToggleButton value="receita" aria-label="receitas" sx={{ px: 1.5, textTransform: 'none' }}>
            <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} /> Receitas
          </ToggleButton>
          <ToggleButton value="despesa" aria-label="despesas" sx={{ px: 1.5, textTransform: 'none' }}>
            <MoneyOffIcon fontSize="small" sx={{ mr: 0.5 }} /> Despesas
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Adjust height to accommodate legend */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={{ top: 5, right: 5, bottom: 40, left: 5 }}> {/* Add bottom margin for legend */}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(204, 204, 204, 0.1)' }} />
          <Legend
            layout="horizontal" // Horizontal layout
            verticalAlign="bottom" // Position at the bottom
            align="center" // Center align items
            iconType="circle" // Use circle as icon
            wrapperStyle={{
              color: textStyle.color,
              fontSize: textStyle.fontSize,
              paddingTop: '20px' // Add padding above legend
            }}
            formatter={(value, entry) => (
              // Use the color from the payload for the circle icon (via CSS potentially, or render custom icon)
              // Recharts default formatter doesn't easily allow custom icons with dynamic color here.
              // A custom legend component might be needed for exact circle color matching.
              // For now, just format the text.
              <span style={{ color: textStyle.color, marginLeft: '5px' }}>{value}</span>
            )}
          />
          <Pie
            data={filteredData}
            cx="50%"
            cy="45%" // Adjusted cy for bottom legend
            labelLine={false}
            label={renderCustomizedLabel} // Use the updated custom label renderer
            outerRadius={120} // Adjusted radius slightly
            innerRadius={40} // Keep donut effect
            fill="#8884d8" // Default fill, overridden by Cell
            dataKey="value"
            nameKey="name"
            stroke="none" // No border between slices
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} /> // Use category color
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryPieChart;

