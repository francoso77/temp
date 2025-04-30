import { CorInterface } from './corInteface'
import { ProdutoInterface } from './produtoInterface'

export interface EstruturaInterface {
  idEstrutura?: number
  idProduto: number
  idUnidade: number
  qtdBase: number
  detalheEstruturas: Array<DetalheEstruturaInterface>
}

export interface DetalheEstruturaInterface {
  idDetalheEstrutura?: number
  idEstrutura: number | null
  idProduto: number
  idCor?: number | null
  qtd: number
  produto: ProdutoInterface
  cor: CorInterface
}
