export enum StatusType {
  pendente = 1,
  em_analise = 2,
  aprovado = 3,
  em_separacao = 4,
  enviado = 5,
  entregue = 6,
  cancelado = 7
}

export const StatusTypes = [
  {
    idStatus: StatusType.pendente,
    descricao: 'Pendente'
  },
  {
    idStatus: StatusType.em_analise,
    descricao: 'Em Análise'
  },
  {
    idStatus: StatusType.aprovado,
    descricao: 'Aprovado'
  },
  {
    idStatus: StatusType.em_separacao,
    descricao: 'Em Separação'
  },
  {
    idStatus: StatusType.enviado,
    descricao: 'Enviado'
  },
  {
    idStatus: StatusType.entregue,
    descricao: 'Entregue'
  },
  {
    idStatus: StatusType.cancelado,
    descricao: 'Cancelado'
  }
]