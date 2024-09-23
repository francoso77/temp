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