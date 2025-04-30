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
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    datasets: [
      {
        label: 'Nylon',
        data: [12, 15, 10, 20, 18, 25, 22, 19, 30, 28, 26, 32], // dados fictícios para o exemplo
        borderColor: '#ff9800',
        fill: false,
      },
      {
        label: 'Palmilhas',
        data: [10, 13, 12, 18, 16, 22, 20, 17, 27, 25, 24, 29], // dados fictícios para o exemplo
        borderColor: '#4caf50',
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
