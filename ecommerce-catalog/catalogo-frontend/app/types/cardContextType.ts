import { ProdutoInterface } from '../interfaces/produto'

export interface CartItem {
  produto: ProdutoInterface
  quantidade: number
}


export interface CartContextType {
  items: CartItem[]
  addItem: (produto: ProdutoInterface, quantidade: number) => void
  removeItem: (produtoId: string) => void
  updateQuantity: (produtoId: string, quantidade: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}