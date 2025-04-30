import { TipoProdutoType } from '../types/tipoProdutoypes'

export interface ProdutoInterface {
  idProduto?: number
  nome: string
  idUnidade: number
  largura?: number
  gm2?: number
  localizacao?: string
  tipoProduto: TipoProdutoType
  ativo: boolean
}
