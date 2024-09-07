//import React from 'react'

// export default function PedidoForm() {
//   return (
//     <></>
//   )
// }

// import React from 'react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import Highcharts3D from 'highcharts/highcharts-3d';

// //Inicializa o módulo 3D
// Highcharts3D(Highcharts);

// const PieChart3D = () => {
//   const options = {
//     chart: {
//       type: 'pie',
//       backgroundColor: '#f5f5f5',
//       options3d: {
//         enabled: true,
//         alpha: 45, // Inclinação
//         beta: 0,   // Rotação
//       },
//     },
//     title: {
//       text: 'Gráfico de Pizza 3D',
//     },
//     plotOptions: {
//       pie: {
//         innerSize: 100, // Para criar um gráfico de rosquinha (opcional)
//         depth: 45,
//       },
//     },
//     series: [
//       {
//         name: 'Porcentagem',
//         data: [
//           ['Produto A', 29.9],
//           ['Produto B', 71.5],
//           ['Produto C', 106.4],
//           ['Produto D', 129.2],
//           ['Produto E', 144.0],
//         ],
//       },
//     ],
//   };

//   return (
//     <div>
//       <HighchartsReact highcharts={Highcharts} options={options} />
//     </div>
//   );
// };

// export default PieChart3D;

// src/components/PieChart.tsx

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Dados do gráfico
const data = [
  ['Produto A', 29.9],
  ['Produto B', 71.5],
  ['Produto C', 106.4],
  ['Produto D', 129.2],
  ['Produto E', 144.0],
];

// Opções do gráfico
const options: Highcharts.Options = {
  chart: {
    type: 'pie',
  },
  title: {
    text: 'Distribuição dos Produtos',
  },
  series: [
    {
      name: 'Total',
      data: data,
      type: 'pie',
      dataLabels: {
        enabled: true,
        format: '{point.name}: {point.y:.1f}', // Formato para mostrar nome e valor
      },
    },
  ],
};

// Componente PieChart
const PieChart: React.FC = () => {
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChart;

