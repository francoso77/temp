import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Title, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Title, Legend, ChartDataLabels);

const VelocimetroPedidos: React.FC = () => {
  const data = {
    labels: ['Completado', 'Restante'],
    datasets: [{
      data: [60, 40],
      backgroundColor: ['#4caf50', '#ddd'],
    }],
  };

  const options: ChartOptions<'doughnut'> = {
    plugins: {
      title: {
        display: true,
        text: 'Produção dos Pedidos',
        font: {
          size: 18,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value: number) => `${value}%`,
      },
    },
    rotation: -90,
    circumference: 180,
  };

  return <Doughnut data={data} options={options} />;
};

export default VelocimetroPedidos;
