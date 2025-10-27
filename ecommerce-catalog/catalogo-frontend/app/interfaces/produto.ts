export interface ProdutoInterface {
  id: string
  nome: string
  descricao: string
  preco: number // Valor formatado no padrão brasileiro, ex: "R$ 28,90"
  idCategoria: string // ID da categoria (relacionamento)
  idVendedor: string // Cada produto pertence a um vendedor
  imagem: string
  desconto?: number // Percentual de desconto formatado, ex: "15%"
  promocao?: boolean // Se o produto está em promoção especial
  maisVendido?: number // Para ordenação
  ativo: boolean
  caracteristicas?: string // Características do produto (separadas por vírgula ou quebra de linha)
}