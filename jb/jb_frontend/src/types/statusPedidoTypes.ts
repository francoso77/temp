export enum StatusPedidoType {
  aberto = 'A',
  producao = 'C',
  finalizado = 'F',
  parcial = 'P',
}

export const StatusPedidoTypes = [
  {
    idStatusPedido: StatusPedidoType.aberto,
    descricao: 'Em aberto'
  },
  {
    idStatusPedido: StatusPedidoType.producao,
    descricao: 'Em produção'
  },
  {
    idStatusPedido: StatusPedidoType.finalizado,
    descricao: 'Finalizado'
  },
  {
    idStatusPedido: StatusPedidoType.parcial,
    descricao: 'Parcial'
  },

]