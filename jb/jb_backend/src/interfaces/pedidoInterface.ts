import { StatusPedidoItemTypes } from '../types/statusPedidoItemTypes'
import { StatusPedidoTypes } from '../types/statusPedidoTypes'

export interface PedidoInterface {
  idPedido?: number
  dataPedido: string
  observacao: string
  idPessoa_cliente: number
  idPessoa_vendedor: number
  idPrazoEntrega: number
  statusPedido: StatusPedidoTypes
}

export interface DetalhePedidoInterface {
  idDetalhePedido?: number
  idPedido: number
  idProduto: number
  qtdPedida: number
  vrUnitario: number
  qtdAtendida: number
  statusItem: StatusPedidoItemTypes
}