import { PedidoMalhariaInterface } from './pedidoMalhariaInterface'
import { ProducaoMalhariaInterface } from './producaoMalhariaInterface'

export interface TinInterface {
  idTinturaria?: number
  dataTinturaria: string
  idPedido_malharia: number
  programado: boolean
  finalizado: boolean
  pedidoMalharia: PedidoMalhariaInterface
  detalheTins: DetalheTinInterface[]
}

export interface DetalheTinInterface {
  idDetalheTinturaria?: number
  idTinturaria: number | null
  idMalharia: number
  malharia: ProducaoMalhariaInterface
}