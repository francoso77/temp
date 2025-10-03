"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Package, ShoppingCart, Download } from "lucide-react"
import { productService, clienteService, pedidoService, vendedorService, categoriaService } from "@/services/api"
import { generateCatalogoPDF, generateClientesPDF, generatePedidosPDF } from "@/lib/pdf-generator"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"

export default function RelatoriosPage() {
  const { user, isVendedor } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleGenerateCatalogo = async () => {
    try {
      setLoading("catalogo")
      const produtos = await productService.getAll(user!.id)
      const vendedor = await vendedorService.getProfile()
      const categorias = await categoriaService.getAll(user!.id)

      await generateCatalogoPDF(produtos, vendedor, categorias)
    } catch (error: any) {
      console.error("Erro ao gerar catálogo:", error)
      alert("Erro ao gerar catálogo PDF: " + (error?.message || error))
    } finally {
      setLoading(null)
    }
  }

  const handleGenerateClientes = async () => {
    try {
      setLoading("clientes")
      const clientes = await clienteService.getAll(user!.id)
      const vendedor = await vendedorService.getProfile()
      await generateClientesPDF(clientes, vendedor)
    } catch (error) {
      console.error("Erro ao gerar relatório de clientes:", error)
      alert("Erro ao gerar relatório de clientes")
    } finally {
      setLoading(null)
    }
  }

  const handleGeneratePedidos = async () => {
    try {
      setLoading("pedidos")
      const pedidos = await pedidoService.getAll(user!.id)

      // Carregar dados dos clientes
      const pedidosComClientes = await Promise.all(
        pedidos.map(async (pedido) => {
          try {
            const cliente = await clienteService.getById(pedido.idCliente)
            return { ...pedido, cliente }
          } catch {
            return pedido
          }
        }),
      )

      const vendedor = await vendedorService.getProfile()
      await generatePedidosPDF(pedidosComClientes, vendedor)
    } catch (error) {
      console.error("Erro ao gerar relatório de pedidos:", error)
      alert("Erro ao gerar relatório de pedidos")
    } finally {
      setLoading(null)
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
            <div>
              <h1 className="font-bold text-3xl">Relatórios</h1>
              <p className="text-muted-foreground">Gere relatórios em PDF dos seus dados</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Catálogo de Produtos</CardTitle>
                      <CardDescription>Lista completa de produtos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gere um PDF com todos os seus produtos, incluindo preços, categorias e promoções.
                  </p>
                  <Button onClick={handleGenerateCatalogo} disabled={loading === "catalogo"} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    {loading === "catalogo" ? "Gerando..." : "Gerar Catálogo"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Relatório de Clientes</CardTitle>
                      <CardDescription>Lista de todos os clientes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gere um PDF com a lista completa de clientes cadastrados, incluindo contatos e datas.
                  </p>
                  <Button onClick={handleGenerateClientes} disabled={loading === "clientes"} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    {loading === "clientes" ? "Gerando..." : "Gerar Relatório"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle>Relatório de Pedidos</CardTitle>
                      <CardDescription>Histórico de vendas</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gere um PDF com todos os pedidos realizados, valores totais e status de cada pedido.
                  </p>
                  <Button onClick={handleGeneratePedidos} disabled={loading === "pedidos"} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    {loading === "pedidos" ? "Gerando..." : "Gerar Relatório"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Sobre os Relatórios</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Os relatórios são gerados em formato PDF e baixados automaticamente</p>
                <p>• Todos os dados são filtrados de acordo com o seu perfil de vendedor</p>
                <p>• Os arquivos incluem cabeçalho com suas informações e data de geração</p>
                <p>• Os relatórios podem ser impressos ou compartilhados com seus clientes</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
