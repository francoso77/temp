export enum PeriodoType {
  mes_atual = 1,
  ultimo_mes = 2,
  ultimos_3_meses = 3,
  ultimos_6_meses = 4,
  ano_atual = 5
}

export const PeriodoTypes = [
  {
    idPeriodo: PeriodoType.mes_atual,
    descricao: 'Mês Atual'
  },
  {
    idPeriodo: PeriodoType.ultimo_mes,
    descricao: 'Último Mês'
  },
  {
    idPeriodo: PeriodoType.ultimos_3_meses,
    descricao: 'Últimos 3 Meses'
  },
  {
    idPeriodo: PeriodoType.ultimos_6_meses,
    descricao: 'Últimos 6 Meses'
  },
  {
    idPeriodo: PeriodoType.ano_atual,
    descricao: 'Ano Atual'
  },
]
