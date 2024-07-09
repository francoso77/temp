import { StatusPedidoItemType } from '../types/statusPedidoItemTypes'
import { StatusPedidoType } from '../types/statusPedidoTypes'

export interface PedidoInterface {
  idPedido?: number
  dataPedido: string
  observacao: string
  idPessoa_cliente: number
  idPessoa_vendedor: number
  idPrazoEntrega: number
  statusPedido: StatusPedidoType
}

export interface DetalhePedidoInterface {
  idDetalhePedido?: number
  idPedido: number
  idProduto: number
  qtdPedida: number
  vrUnitario: number
  qtdAtendida: number
  statusItem: StatusPedidoItemType
}