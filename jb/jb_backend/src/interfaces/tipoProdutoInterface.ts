import { TipoProdutoTypes } from '../types/tipoProdutoTypes'

export interface TipoProdutoInterface {
  idTipoProduto?: number
  nome: string
  tipo: TipoProdutoTypes
}
