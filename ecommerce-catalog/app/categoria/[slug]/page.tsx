"use client"

import { useState, useEffect } from "react"
import type { Categoria } from "@/lib/types"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Header } from "@/components/Header"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/types"
import { productService, categoriaService } from "@/services/api"
const [categorias, setCategorias] = useState<Categoria[]>([])
useEffect(() => {
  categoriaService.getAll("").then(setCategorias)
}, [])

export default function CategoryPage() {
  const params = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [loading, setLoading] = useState(true)
  const [categoryName, setCategoryName] = useState("")

  useEffect(() => {
    if (params.slug) {
      loadCategoryProducts(params.slug as string)
    }
  }, [params.slug])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, sortBy])

  const loadCategoryProducts = async (slug: string) => {
    try {
      const allProducts = await productService.getAll()
      const categoryProducts = allProducts.filter((product) => {
        const categoria = categorias.find((c) => c.id === product.idCategoria)
        return categoria?.nome.toLowerCase().replace(/\s+/g, "-") === slug
      })
      if (categoryProducts.length > 0) {
        const categoria = categorias.find((c) => c.id === categoryProducts[0].idCategoria)
        setCategoryName(categoria?.nome || "")
      }

      setProducts(categoryProducts)
    } catch (error) {
      console.error("Erro ao carregar produtos da categoria:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = products

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nome.localeCompare(b.nome)
        case "price-low": {
          const pa = parseFloat(a.preco.replace("R$", "").replace(".", "").replace(",", "."))
          const pb = parseFloat(b.preco.replace("R$", "").replace(".", "").replace(",", "."))
          return pa - pb
        }
        case "price-high": {
          const pa = parseFloat(a.preco.replace("R$", "").replace(".", "").replace(",", "."))
          const pb = parseFloat(b.preco.replace("R$", "").replace(".", "").replace(",", "."))
          return pb - pa
        }
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
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
          <span className="text-foreground">{categoryName}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catálogo
          </Link>
        </Button>

        {/* Category Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">
            {loading ? "Carregando..." : `${filteredProducts.length} produtos encontrados`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar nesta categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="price-low">Menor preço</SelectItem>
                <SelectItem value="price-high">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg border border-border animate-pulse">
                <div className="bg-muted h-48 rounded-md mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded mb-4"></div>
                <div className="bg-muted h-8 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum produto encontrado nesta categoria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSortBy("name")
              }}
              className="mt-4"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
