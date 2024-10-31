import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LinhasTipoProdutos: React.FC = () => {
  const data = {
    labels: ['Tipo 1', 'Tipo 2', 'Tipo 3', 'Tipo 4'],
    datasets: [
      {
        label: 'Produtos',
        data: [10, 15, 12, 20],
        borderColor: '#ff9800',
        fill: false,
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

  return <Line data={data} options={options} />;
};

export default LinhasTipoProdutos;

