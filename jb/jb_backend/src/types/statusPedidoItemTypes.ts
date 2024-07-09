export enum StatusPedidoItemType {
  aberto = 0,
  fechado = 1,
  parcial = 2,
  programado = 3
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