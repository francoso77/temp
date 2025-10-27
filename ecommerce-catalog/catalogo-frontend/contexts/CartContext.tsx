"use client"

import { ProdutoInterface } from '@/app/interfaces/produto'
import { CartContextType, CartItem } from '@/app/types/cardContextType'
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (produto: ProdutoInterface, quantidade: number) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.produto.id === produto.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item,
        )
      }

      return [...currentItems, { produto, quantidade }]
    })
  }

  const removeItem = (produtoId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.produto.id !== produtoId))
  }

  const updateQuantity = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.produto.id === produtoId ? { ...item, quantidade } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.produto.preco * item.quantidade, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
