import { StatusType } from '../types/statusTypes'
import { ProdutoInterface } from './produtoInterface'

export interface PedidoMalhariaInterface {
  idPedido?: number
  dataPedido: string
  observacao: string
  idPessoa_cliente: number
  idPessoa_fornecedor: number
  statusPedido: StatusType
  detalhePedidoMalharias: DetalhePedidoMalhariaInterface[]
}

export interface DetalhePedidoMalhariaInterface {
  idDetalhePedido?: number
  idPedido: number | null
  idProduto: number
  qtdPedida: number
  vrUnitario: number
  produto: ProdutoInterface
}