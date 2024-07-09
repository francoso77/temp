export enum StatusPedidoType {
  aberto = 'A',
  cancelado = 'C',
  fechado = 'F',
  parcial = 'P',
}

export const StatusPedidoTypes = [
  {
    idStatusPedido: StatusPedidoType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatusPedido: StatusPedidoType.cancelado,
    descricao: 'Cancelado'
  },
  {
    idStatusPedido: StatusPedidoType.fechado,
    descricao: 'Fechado'
  },
  {
    idStatusPedido: StatusPedidoType.parcial,
    descricao: 'Parcial'
  },

]