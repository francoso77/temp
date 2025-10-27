"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { categoriaService, produtoService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { ProdutoInterface } from './interfaces/produto'
import { CategoriaInterface } from './interfaces/categoria'

export default function HomePage() {
  const { vendedorId, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<ProdutoInterface[]>([])
  const [categorias, setCategorias] = useState<CategoriaInterface[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProdutoInterface[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [vendedorId, isAuthenticated])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, sortBy])

  const loadProducts = async () => {
    try {
      if (!isAuthenticated) {
        // Usuário não autenticado - carregar todos os produtos
        const data = await produtoService.getFull()
        setProducts(data)
      } else {
        const data = await produtoService.getAll(vendedorId as string)
        setProducts(data)
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      if (!isAuthenticated) {
        const data = await categoriaService.getFull()
        setCategorias(data)
      } else {
        const data = await categoriaService.getAll(vendedorId as string)
        setCategorias(data)
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    }
  }

  const filterAndSortProducts = () => {
    if (!products) return
    loadProducts()

    let filtered = products

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.idCategoria === selectedCategory)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          // Ordem alfabética crescente
          return a.nome.localeCompare(b.nome)

        case "mais-vendidos":
          // Mais vendidos do maior para o menor
          const vendidosA = a.maisVendido || 0
          const vendidosB = b.maisVendido || 0
          if (vendidosA !== vendidosB) return vendidosB - vendidosA
          return a.nome.localeCompare(b.nome)

        case "promocao":
          // Produtos em promoção primeiro, em ordem alfabética
          if (a.promocao && !b.promocao) return -1
          if (!a.promocao && b.promocao) return 1
          return a.nome.localeCompare(b.nome)

        case "desconto":
          // Maiores descontos primeiro
          const descontoA = a.desconto || 0
          const descontoB = b.desconto || 0
          if (descontoA !== descontoB) return descontoB - descontoA
          return a.nome.localeCompare(b.nome)

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Material de Construção</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Encontre os melhores materiais de construção civil. Solicite seu orçamento de forma rápida e prática.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="mais-vendidos">Mais Vendidos</SelectItem>
                <SelectItem value="promocao">Em Promoção</SelectItem>
                <SelectItem value="desconto">Maiores Descontos</SelectItem>
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
            <p className="text-muted-foreground text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
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
