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

// Inicializa o módulo 3D
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

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import ClsCrud from '../../Utils/ClsCrudApi';

type MesesIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface MesesMapping {
  [index: number]: string;
}

interface DadosGraficoItem {
  mes: MesesIndex;
  pesoTotal: number;
  qtdTotal: number;
}

const meses: MesesMapping = {
  1: 'Janeiro',
  2: 'Fevereiro',
  3: 'Março',
  4: 'Abril',
  5: 'Maio',
  6: 'Junho',
  7: 'Julho',
  8: 'Agosto',
  9: 'Setembro',
  10: 'Outubro',
  11: 'Novembro',
  12: 'Dezembro',
};

// Função para obter o nome do mês a partir do índice
function obterMes(index: MesesIndex): string {
  return meses[index];
}

// Inicializa o módulo 3D
Highcharts3D(Highcharts);

const ColumnChart3D = () => {
  const [mesesData, setMesesData] = useState<string[]>([]);
  const [pesosData, setPesosData] = useState<number[]>([]);
  const [qtdsData, setQtdsData] = useState<number[]>([]);

  const clsCrud = new ClsCrud();

  const DadosGrafico = async () => {
    try {
      const rs: DadosGraficoItem[] = await clsCrud.consultar({
        entidade: 'ProducaoMalharia',
        joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
        groupBy: 'mes',
        campoOrder: ['mes'],
        having: 'pesoTotal > 0',
        select: ['ROUND(SUM(peso),2) AS pesoTotal', 'COUNT(peso) AS qtdTotal', 'MONTH(dataProducao) AS mes'],
      });

      const mesesData = rs.map((item) => obterMes(item.mes));
      const pesosData = rs.map((item) => item.pesoTotal);
      const qtdsData = rs.map((item) => item.qtdTotal*10);

      setMesesData(mesesData);
      setPesosData(pesosData);
      setQtdsData(qtdsData);
    } catch (error) {
      console.error('Erro ao consultar dados:', error);
    }
  };

  useEffect(() => {
    DadosGrafico();
  }, []);

  const options = {
    chart: {
      type: 'column',
      backgroundColor: '#f5f5f5',
      options3d: {
        enabled: true,
        alpha: 10, // Inclinação
        beta: 25,  // Rotação
        depth: 250, // Profundidade
      },
    },
    title: {
      text: 'Produção Malharia',
    },
    xAxis: {
      categories: mesesData,
    },
    yAxis: {
      title: {
        text: 'Valor',
      },
      labels: {
        format: '{value}',
      },
    },
    plotOptions: {
      column: {
        depth: 50, // Profundidade das colunas
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: 'Produção',
        data: pesosData,
        color: '#7cb5ec', // Cor das colunas para produção
      },
      {
        name: 'Quantidade',
        data: qtdsData,
        color: '#434348', // Cor das colunas para quantidade
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ColumnChart3D;

