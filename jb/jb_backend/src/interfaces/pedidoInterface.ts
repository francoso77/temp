import { StatusPedidoItemType } from '../types/statusPedidoItemTypes'
import { StatusPedidoType } from '../types/statusPedidoTypes'
import { CorInterface } from './corInteface'
import { ProdutoInterface } from './produtoInterface'

export interface PedidoInterface {
  idPedido?: number
  dataPedido: string
  observacao: string
  idPessoa_cliente: number
  idPessoa_vendedor: number
  idPrazoEntrega: number
  statusPedido: StatusPedidoType
  detalhePedidos: DetalhePedidoInterface[]
}

export interface DetalhePedidoInterface {
  idDetalhePedido?: number
  idPedido: number | null
  idProduto: number
  idCor: number | null
  qtdPedida: number
  vrUnitario: number
  qtdAtendida: number
  statusItem: StatusPedidoItemType
  produto: ProdutoInterface
  cor: CorInterface
}