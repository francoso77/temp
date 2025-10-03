"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/types"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { categoryService } from '@/services/api'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {

  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isVendedor, isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    if (!isAuthenticated) return
    addItem(product, quantity)
    setQuantity(1)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const FilterCategory = async (id: string) => {
    const categories = categoryService.getAll()
    const category = (await categories).find((c) => c.id === id)
    return category?.name
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border">
      <CardContent className="p-4">
        <div className="relative overflow-hidden rounded-md mb-4">
          <Image
            src={product.imagem || "/placeholder.svg"}
            alt={product.nome}
            width={300}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge variant="secondary" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
            {FilterCategory(product.idCategoria)}
          </Badge>

          {product.desconto && product.desconto > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm">
              -{product.desconto}% OFF
            </Badge>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link href={`/produto/${product.id}`}>
              <Button variant="secondary" size="sm" className="bg-background/90 backdrop-blur-sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver detalhes
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-2">
          <Link href={`/produto/${product.id}`}>
            <h3 className="font-semibold text-lg text-foreground line-clamp-2 text-balance hover:text-primary transition-colors">
              {product.nome}
            </h3>
          </Link>

          <p className="text-muted-foreground text-sm line-clamp-2 text-pretty">{product.descricao}</p>

          {product.promocao && (
            <div className="flex items-center justify-center">
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                🎉 PROMOÇÃO ESPECIAL
              </Badge>
            </div>
          )}
        </div>
      </CardContent>

      {!isVendedor && (
        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={decrementQuantity} className="h-8 w-8 p-0 bg-transparent">
                <Minus className="h-3 w-3" />
              </Button>

              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-16 text-center h-8"
              />

              <Button variant="outline" size="sm" onClick={incrementQuantity} className="h-8 w-8 p-0 bg-transparent">
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} className="w-full" size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
