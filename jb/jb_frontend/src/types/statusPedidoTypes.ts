export enum StatusPedidoType {
  aberto = 1,
  finalizado = 2,
  producao = 3
}

export const StatusPedidoTypes = [

  {
    idStatusPedido: StatusPedidoType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatusPedido: StatusPedidoType.finalizado,
    descricao: 'Finalizado'
  },
  {
    idStatusPedido: StatusPedidoType.producao,
    descricao: 'Em produção'
  },

]