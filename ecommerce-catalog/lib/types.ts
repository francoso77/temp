export interface Product {
  id: string
  nome: string
  descricao: string
  preco: string // Valor formatado no padrão brasileiro, ex: "R$ 28,90"
  idCategoria: string // ID da categoria (relacionamento)
  idVendedor: string // Cada produto pertence a um vendedor
  imagem: string
  desconto?: string // Percentual de desconto formatado, ex: "15%"
  promocao?: boolean // Se o produto está em promoção especial
  maisVendido?: boolean // Para ordenação
  ativo: boolean
  caracteristicas?: string // Características do produto (separadas por vírgula ou quebra de linha)
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone?: string
  cnpj?: string
  ativo: boolean
  idVendedor: string // Cliente pertence a um vendedor
  dataCadastro: string
}

export interface CartItem {
  product: Product
  quantidade: number
}

export interface Pedido {
  id: string
  idCliente: string
  idVendedor: string // Pedido pertence a um vendedor
  data: string
  total: string // Valor formatado pt-BR
  desconto?: string // Valor ou percentual de desconto aplicado ao pedido
  status: "pendente" | "em_analise" | "aprovado" | "em_separacao" | "enviado" | "entregue" | "cancelado"
  cliente?: Cliente
  itens?: DetalhePedido[]
  observacoes?: string
}

export interface DetalhePedido {
  id: string
  idPedido: string
  idProduto: string
  quantidade: number
  subtotal: string // Valor formatado pt-BR
  produto?: Product
}

export interface Vendedor {
  id: string
  nome: string
  cnpj: string
  whatsapp: string
  email: string
  senha: string
  dataCadastro: string
}

export interface Categoria {
  id: string
  nome: string
  descricao?: string
  idVendedor: string
  ativo: boolean
  dataCriacao: string
}

export interface AuthContextType {
  user: Cliente | Vendedor | null
  login: (email: string, senha?: string, tipo?: "cliente" | "vendedor") => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isVendedor: boolean
  vendedorId?: string // ID do vendedor logado
}

export interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantidade: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantidade: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}
