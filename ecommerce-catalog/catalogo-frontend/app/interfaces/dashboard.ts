export interface ReceitaMesInterface {
  month: string
  pedidos: number
  vendas: number
}

export interface ReceitaDiaInterface {
  day: string
  vendas: number
}

export interface ReceitaComparativoInterface {
  percentualReceita: number
  percentualPedidos: number
  percentualTicket: number
  percentualClientes: number
}
export interface ReceitasInterface {
  receitaAtual: number
  qtdAtual: number
  ticketAtual: number
  clientesAtual: number
  receitasUltimos6Meses: ReceitaMesInterface[]
  receitaSemana: ReceitaDiaInterface[]
  receitaComparativo: ReceitaComparativoInterface
}
