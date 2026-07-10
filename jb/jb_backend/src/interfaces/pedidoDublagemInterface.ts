import { StatusType } from '../types/statusTypes'
import { CorInterface } from './corInteface'
import { ProdutoInterface } from './produtoInterface'

export interface PedidoDublagemInterface {
  idPedido?: number
  dataPedido: string
  observacao: string
  idPessoa_cliente: number
  idPessoa_vendedor: number
  idPrazoEntrega: number
  statusPedido: StatusType
  detalhePedidos: DetalhePedidoDublagemInterface[]
}

export interface DetalhePedidoDublagemInterface {
  idDetalhePedido?: number
  idPedido: number | null
  idProduto: number
  idCor: number | null
  qtdPedida: number
  vrUnitario: number
  qtdAtendida: number
  statusItem: StatusType
  produto: ProdutoInterface
  cor: CorInterface
}