export enum GraficoType {
  mes = 'mes',
  produto = 'produto',
  tecelao = 'tecelao',
  perda = 'perda'
}

export const GraficoTypes = [
  {
    idGraficoType: GraficoType.mes,
    descricao: 'Gráfico por Mensal'
  },
  {
    idGraficoType: GraficoType.produto,
    descricao: 'Gráfico por Produto'
  },
  {
    idGraficoType: GraficoType.tecelao,
    descricao: 'Gráfico por Tecelão'
  },
  {
    idGraficoType: GraficoType.perda,
    descricao: 'Gráfico por Perda'
  },
]

export interface DataPoint {
  date: string; // Ou Date, dependendo de como os dados são processados
  receitas: number;
  despesas: number;
}

export interface FinancialChartProps {
  data: DataPoint[];
  backgroundColor?: string;
  borderColor?: string;
  // Adicionaremos mais props para controle conforme necessário
}

export interface CategoryDataPoint {
  name: string; // Nome da categoria
  value: number; // Valor (receita ou despesa)
  color: string; // Cor da categoria (ex: '#FF8042')
  type: 'receita' | 'despesa'; // Tipo da categoria
}

export interface CategoryPieChartProps {
  data: CategoryDataPoint[];
  // Props de estilo opcionais, se necessário além do solicitado
  // borderColor?: string; // Já solicitado como claro
  // fontColor?: string; // Já solicitado como claro
}