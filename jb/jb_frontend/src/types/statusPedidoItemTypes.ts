export enum StatusPedidoItemType {
  aberto = 'A',
  producao = 'C',
  finalizado = 'F',
  parcial = 'P',
}

export const StatusPedidoItemTypes = [
  {
    idStatusPedidoItem: StatusPedidoItemType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.producao,
    descricao: 'Em produção'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.finalizado,
    descricao: 'Finalizado'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.parcial,
    descricao: 'Parcial'
  },
]