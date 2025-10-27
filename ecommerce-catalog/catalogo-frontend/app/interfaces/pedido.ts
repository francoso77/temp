import { StatusType } from '../types/statusType'
import { ClienteInterface } from './cliente'
import { ProdutoInterface } from './produto'

export interface PedidoInterface {
  id: string
  numeroPedido: string
  idCliente: string
  idVendedor: string // Pedido pertence a um vendedor
  data: string
  total: number
  desconto: number
  totalDescontado: number
  status: StatusType
  cliente: ClienteInterface
  itens: DetalhePedidoInterface[]
  observacoes?: string
}
export interface DetalhePedidoInterface {
  id?: string
  idPedido?: string
  idProduto: string
  quantidade: number
  preco: number
  subtotal: number
  produto: ProdutoInterface
}