export enum StatusType {
  aberto = 1,
  producao = 2,
  parcial = 3,
  finalizado = 4,
}

export const StatusTypes = [
  {
    idStatus: StatusType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatus: StatusType.producao,
    descricao: 'Em produção'
  },
  {
    idStatus: StatusType.parcial,
    descricao: 'Parcial'
  },
  {
    idStatus: StatusType.finalizado,
    descricao: 'Finalizado'
  },
]