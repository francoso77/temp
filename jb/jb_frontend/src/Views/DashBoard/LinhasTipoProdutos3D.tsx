import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';

// Inicializa o módulo 3D
Highcharts3D(Highcharts);

const LinhasTipoProdutos3D: React.FC = () => {
  const options: Highcharts.Options = {
    chart: {
      type: 'area',
      options3d: {
        enabled: true,
        alpha: 15, // Ângulo de inclinação
        beta: 15, // Ângulo de rotação lateral
        viewDistance: 25, // Distância da visualização para um efeito 3D mais evidente
      },
    },
    title: {
      text: 'Produção Mensal por Tipo de Produto',
    },
    xAxis: {
      categories: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ],
      title: { text: 'Meses' },
    },
    yAxis: {
      title: { text: 'Quantidade' },
    },
    series: [
      {
        type: 'area',
        name: 'Nylon',
        data: [12, 15, 10, 20, 18, 25, 22, 19, 30, 28, 26, 32],
        color: '#ff9800',
      },
      {
        type: 'area',
        name: 'Palmilhas',
        data: [10, 13, 12, 18, 16, 22, 20, 17, 27, 25, 24, 29],
        color: '#4caf50',
      },
    ],
    plotOptions: {
      area: {
        marker: {
          enabled: false,
        },
      },
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default LinhasTipoProdutos3D;
