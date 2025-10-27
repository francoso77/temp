export interface ProdutoInterface {
  id: string
  nome: string
  descricao: string
  preco: number
  idCategoria: string
  idVendedor: string
  imagem: string
  desconto?: number
  promocao?: boolean // Se o produto está em promoção especial
  maisVendido?: number // Para ordenação
  ativo: boolean
  caracteristicas?: string // Características do produto (separadas por vírgula ou quebra de linha)
}