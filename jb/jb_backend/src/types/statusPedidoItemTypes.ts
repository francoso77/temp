export enum StatusPedidoItemType {
  aberto = 1,
  fechado = 2,
  parcial = 3,
  programado = 4
}

export const StatusPedidoItemTypes = [
  {
    idStatusPedidoItem: StatusPedidoItemType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.fechado,
    descricao: 'Fechado'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.parcial,
    descricao: 'Parcial'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.programado,
    descricao: 'Programado'
  },
]