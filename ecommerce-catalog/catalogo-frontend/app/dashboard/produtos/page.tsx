"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { produtoService, categoriaService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { ProdutoInterface } from '@/app/interfaces/produto'
import { CategoriaInterface } from '@/app/interfaces/categoria'

export default function ProductsManagementPage() {
  const { user, isVendedor, setMensagemState } = useAuth()
  const [products, setProducts] = useState<ProdutoInterface[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProdutoInterface[]>([])
  const [categorias, setCategorias] = useState<CategoriaInterface[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isVendedor && user) {
      loadProducts()
      categoriaService.getAll(user.idUsuario).then((data) => setCategorias(data))
    }
  }, [isVendedor, user])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory])

  const loadProducts = async () => {
    try {
      const data = await produtoService.getAll(user!.idUsuario)
      setProducts(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
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
      filtered = filtered.filter((product) => {
        const categoria = categorias.find((c) => c.id === product.idCategoria)
        return categoria?.nome === selectedCategory
      })
    }

    setFilteredProducts(filtered)
  }

  // const handleDeleteProduct = async (product: ProdutoInterface) => {
  //   try {
  //     await produtoService.delete(product.id, user!.idUsuario)
  //     setProducts(products.filter((p) => p.id !== product.id))
  //     setDeleteProduct(null)
  //   } catch (error) {
  //     console.error("Erro ao excluir produto:", error)
  //     alert("Erro ao excluir produto. Tente novamente.")
  //   }
  // }

  const handleDelete = async (id: string) => {

    const deleteProduto = products.find((c) => c.id === id)

    setMensagemState({
      titulo: 'Excluir Produto ...',
      exibir: true,
      mensagem: "Tem certeza que deseja excluir o produto " + deleteProduto?.nome + "? Esta ação não pode ser desfeita.",
      tipo: 'error',
      exibirBotao: "SN",
      cb: async (resposta: boolean) => {
        if (resposta) {
          try {
            await produtoService.delete(id, user!.token)
            await loadProducts()
          } catch (error) {
            console.error("Erro ao excluir produto:", error)
            setMensagemState({
              titulo: 'Erro',
              exibir: true,
              mensagem: "Erro ao excluir produto.",
              tipo: 'warning',
              exibirBotao: true,
              cb: () => { }
            })
          }
        }
      }
    })
  }
  const formatPrice = (value: string | number, tipo: 'preco' | 'desconto'): string => {
    // Se for string com "R$" no início, apenas normaliza o espaço
    if (typeof value === "string" && value.trim().startsWith("R$")) {
      return value.trim()
    }

    // Converte para número
    const num = Number(value)

    // Se for número válido, formata para moeda BRL
    if (!isNaN(num) && tipo === 'preco') {
      return num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    } else {
      return num.toLocaleString("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })

    }

  }


  if (!isVendedor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Acesso negado. Apenas vendedores podem acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Gerenciar Produtos</h1>
                <p className="text-muted-foreground text-sm">Adicione, edite e remova produtos do seu catálogo</p>
              </div>
              <Link href="/dashboard/produtos/novo">
                <Button >
                  <Plus className="h-4 w-4 mb-2" />
                  Novo Produto
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <Card className="mt-2 mb-2 md:w-full sm:w-full w-85">
            <CardContent className="p-4">
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
                  <SelectTrigger className="md:w-48">
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
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <div className="md:w-full sm:w-full w-85">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Produtos ({filteredProducts.length})</span>
                  <Badge variant="secondary">{products.length} total</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 animate-pulse">
                        <div className="bg-muted h-16 w-16 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-muted h-4 rounded w-3/4"></div>
                          <div className="bg-muted h-3 rounded w-1/2"></div>
                        </div>
                        <div className="bg-muted h-8 w-20 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Nenhum produto encontrado.</p>
                    <Link href="/dashboard/produtos/novo">
                      <Button className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar primeiro produto
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="w-28">Preço</TableHead>
                        <TableHead>Desconto</TableHead>
                        <TableHead>Promoção</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Image
                                src={product.imagem || "/placeholder.svg"}
                                alt={product.nome}
                                width={48}
                                height={48}
                                className="rounded-md object-cover"
                              />
                              <div>
                                <p className="font-medium text-foreground line-clamp-1">{product.nome}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{product.descricao}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{categorias.find((c) => c.id === product.idCategoria)?.nome || "Sem categoria"}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-primary w-28 whitespace-nowrap">{formatPrice(product.preco, "preco")}</TableCell>
                          <TableCell>
                            {product.desconto && product.desconto > 0 ? formatPrice(product.desconto, "desconto") + '%' : <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell>
                            {product.promocao ? <Badge variant="destructive">Promoção</Badge> : <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.ativo ? "secondary" : "outline"}>
                              {product.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/produto/${product.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver produto
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/produtos/${product.id}/editar`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{deleteProduct?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProduct && handleDeleteProduct(deleteProduct)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  )
}
