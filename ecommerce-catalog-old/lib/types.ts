export interface Product {
  id: string
  nome: string
  descricao: string
  caracteristicas?: string
  preco: string
  idCategoria: string // FK categoria
  categoria?: Category
  imagem: string
  desconto?: number // Percentual de desconto (ex: 15 para 15%)
  promocao?: boolean // Se o produto está em promoção especial
  idRep: string // FK representante
  ativo: boolean
}

export interface Representante {
  id: string // FK usuario
  nome: string
  email: string
  cnpj: string
  whatsapp: string
}
export interface Cliente {
  id: string // FK usuario
  nome: string
  cnpj: string
  email: string
  whatsapp: string
  idRep: string // FK representante
  ativo: boolean
  dataCadastro: string
}

export interface CartItem {
  product: Product
  quantidade: number
}

export interface Pedido {
  id: string
  idCliente: string // FK cliente
  cliente?: Cliente
  idRep: string // FK representante
  representante?: Representante
  data: string
  total: number
  itens?: DetalhePedido[]
  status: "aberto" | "concluido" | "cancelado"
}

export interface DetalhePedido {
  id: string
  idPedido: string
  idProduto: string
  quantidade: number
  subtotal: number
  produto?: Product
}

export interface Usuario {
  id: string
  nome: string
  email: string
  whatsapp: string
  senha: string
  cnpj: string
  perfil: "cliente" | "vendedor"
}

export interface AuthContextType {
  user: Usuario | null
  login: (email: string, senha?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isVendedor: boolean
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

export interface Category {
  id: string
  name: string
}