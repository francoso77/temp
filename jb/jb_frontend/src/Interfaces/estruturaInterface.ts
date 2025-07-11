import { CorInterface } from './corInteface'
import { ProdutoInterface } from './produtoInterface'

export interface EstruturaInterface {
  idEstrutura?: number
  idProduto: number
  detalheEstruturas: Array<DetalheEstruturaInterface>
}

export interface DetalheEstruturaInterface {
  idDetalheEstrutura?: number
  idEstrutura: number | null
  idProduto: number
  idCor?: number | null
  qtd: number
  nivel: 'nível1' | 'nível2' | 'nível3' | 'nível4'
  produto: ProdutoInterface
  cor: CorInterface
}
