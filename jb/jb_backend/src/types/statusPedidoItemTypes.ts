export enum StatusPedidoItemType {
  aberto = 1,
  finalizado = 2,
  producao = 3
}

export const StatusPedidoItemTypes = [
  {
    idStatusPedidoItem: StatusPedidoItemType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.finalizado,
    descricao: 'Finalizado'
  },
  {
    idStatusPedidoItem: StatusPedidoItemType.producao,
    descricao: 'Em produção'
  },
]