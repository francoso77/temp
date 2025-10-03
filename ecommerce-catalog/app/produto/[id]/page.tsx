"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"
import type { Product, Categoria } from "@/lib/types"
import { productService, categoriaService } from "@/services/api"
import { useCart } from "@/contexts/CartContext"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    if (params.id) {
      loadProduct(params.id as string)
    }
    categoriaService.getAll("").then(setCategorias)
  }, [params.id])

  const loadProduct = async (id: string) => {
    try {
      const allProducts = await productService.getAll()
      const foundProduct = allProducts.find((p) => p.id === id)

      if (!foundProduct) {
        router.push("/")
        return
      }

      setProduct(foundProduct)

      // Load related products from same category
      const related = allProducts
        .filter((p) => p.idCategoria === foundProduct.idCategoria && p.id !== foundProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error) {
      console.error("Erro ao carregar produto:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  // Função para converter string 'R$ 1.234,56' para número
  function parseBRL(value: string | number): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      return Number(value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim())
    }
    return 0
  }

  // Função para converter string '15%' para número
  function parsePercent(value: string | number): number {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      return Number(value.replace("%", "").replace(",", ".").trim())
    }
    return 0
  }

  const formatPrice = (price: string | number) => {
    const num = parseBRL(price)
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setQuantity(1)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted h-8 w-32 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-muted h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-muted h-8 rounded"></div>
                <div className="bg-muted h-4 rounded w-3/4"></div>
                <div className="bg-muted h-6 rounded w-1/2"></div>
                <div className="bg-muted h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Link href="/">
            <Button>Voltar ao catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.nome}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.imagem || "/placeholder.svg"}
                alt={product.nome}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <Badge variant="secondary" className="absolute top-4 left-4">
                {categorias.find((c) => c.id === product.idCategoria)?.nome || "Sem categoria"}
              </Badge>
              {product.promocao && (
                <Badge variant="destructive" className="absolute top-4 right-4 animate-pulse">
                  Promoção Especial
                </Badge>
              )}
              {product.desconto && Number(product.desconto) > 0 && (
                <Badge variant="destructive" className="absolute top-16 right-4">
                  -{product.desconto}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{product.nome}</h1>
              <p className="text-lg text-muted-foreground text-pretty">{product.descricao}</p>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.preco)}</span>
                {product.desconto && parsePercent(product.desconto) > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(parseBRL(product.preco) / (1 - parsePercent(product.desconto) / 100))}
                    </span>
                    <Badge variant="destructive">-{product.desconto}</Badge>
                  </>
                )}
                {product.promocao && (
                  <Badge variant="destructive">Promoção Especial</Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Quantidade:</label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementQuantity}
                    className="h-10 w-10 p-0 bg-transparent"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-20 text-center h-10"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                    className="h-10 w-10 p-0 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={handleAddToCart} className="w-full" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>

            {product.caracteristicas && product.caracteristicas.trim() !== "" && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">Características do produto:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {product.caracteristicas.split("\n").map((caracteristica, index) => (
                      <li key={index}>• {caracteristica}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Produtos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <Link href={`/produto/${relatedProduct.id}`}>
                      <div className="relative overflow-hidden rounded-md mb-3">
                        <Image
                          src={relatedProduct.imagem || "/placeholder.svg"}
                          alt={relatedProduct.nome}
                          width={200}
                          height={200}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium text-foreground line-clamp-2 mb-2 text-balance">
                        {relatedProduct.nome}
                      </h3>
                      <p className="text-lg font-bold text-primary">{formatPrice(relatedProduct.preco)}</p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
