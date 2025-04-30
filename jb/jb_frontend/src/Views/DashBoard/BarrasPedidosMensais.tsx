import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarrasPedidosMensais: React.FC = () => {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Pedidos',
        data: [510, 1020, 835, 1510, 290, 1299, 1070, 1250, 500, 900, 400, 600],
        backgroundColor: '#daae5c',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category' as const,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarrasPedidosMensais;

