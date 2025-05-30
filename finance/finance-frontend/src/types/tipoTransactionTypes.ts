export enum TipoTransactionType {
  Receita = 'Receita',
  Despesa = 'Despesa',
}

export const TipoTransactionTypes = [
  {
    idTipoTransactionType: TipoTransactionType.Receita,
    descricao: 'Receita'
  },
  {
    idTipoTransactionType: TipoTransactionType.Despesa,
    descricao: 'Despesa'
  },
]