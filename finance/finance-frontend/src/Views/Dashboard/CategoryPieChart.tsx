import React, { useState } from 'react';
import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icon for Receitas
import MoneyOffIcon from '@mui/icons-material/MoneyOff'; // Icon for Despesas
import { CategoryPieChartProps, CategoryDataPoint } from '../../types/graficoTypes';

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
  const lightBorderColor = 'rgba(204, 204, 204, 0.5)';

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

  // Custom Label for Pie Slices
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Position label inside the slice
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only render label if percent is large enough to avoid clutter
    if (percent < 0.03) { // Threshold: 3%
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff" // White text for labels
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="0.8rem"
        fontWeight="bold"
        // Add a subtle stroke for better contrast against similar slice colors
        style={{ paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.5)', strokeWidth: '2px', strokeLinecap: 'butt', strokeLinejoin: 'miter' }}
      >
        {`R$${value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`}
      </text>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        padding: 3,
        backgroundColor: 'transparent', // Transparent background
        border: `1px solid ${lightBorderColor}`, // Clear border
        borderRadius: '8px',
        color: textStyle.color // Set default text color to clear
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
          <ToggleButton value="receita" aria-label="receitas" sx={{ px: 1.5 }}>
            <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} /> Receitas
          </ToggleButton>
          <ToggleButton value="despesa" aria-label="despesas" sx={{ px: 1.5 }}>
            <MoneyOffIcon fontSize="small" sx={{ mr: 0.5 }} /> Despesas
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(204, 204, 204, 0.1)' }} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ color: textStyle.color, fontSize: textStyle.fontSize, paddingLeft: '20px' }}
            formatter={(value, entry) => (
              <span style={{ color: textStyle.color }}>{value}</span> // Legend text color
            )}
          />
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel} // Use the custom label renderer
            outerRadius={130} // Slightly increased radius
            innerRadius={40} // Add a small inner radius for donut effect, helps label placement
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

