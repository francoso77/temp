"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Users,
  Package,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Eye,
  Edit,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useAuth } from "@/contexts/AuthContext"
import type { Pedido } from "@/lib/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

export default function DashboardPage() {
  const { user, isVendedor } = useAuth()
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isVendedor) {
      router.push("/login")
      return
    }
    loadDashboardData()
  }, [isVendedor, router])

  const loadDashboardData = async () => {
    try {
      // Mock data for dashboard
      const mockOrders: Pedido[] = [
        {
          id: "1",
          idCliente: "1",
          data: "2024-01-15T10:30:00Z",
          total: 2799.98,
          cliente: {
            id: "1", nome: "João Silva", email: "joao@email.com", idRep: "1", ativo: true,
            cnpj: '',
            whatsapp: '',
            dataCadastro: ''
          },
          idRep: "1",
          status: "aberto",
        },
        {
          id: "2",
          idCliente: "2",
          data: "2024-01-14T15:45:00Z",
          total: 1299.99,
          cliente: {
            id: "2", nome: "Maria Santos", email: "maria@email.com", idRep: "1", ativo: true,
            cnpj: '',
            whatsapp: '',
            dataCadastro: ''
          },
          idRep: "1",
          status: "aberto",
        },
        {
          id: "3",
          idCliente: "3",
          data: "2024-01-13T09:20:00Z",
          total: 899.99,
          cliente: {
            id: "3", nome: "Pedro Costa", email: "pedro@email.com", idRep: "1", ativo: true,
            cnpj: '',
            whatsapp: '',
            dataCadastro: ''
          },
          idRep: "1",
          status: "aberto",
        },
        {
          id: "4",
          idCliente: "4",
          data: "2024-01-12T14:10:00Z",
          total: 3499.99,
          cliente: {
            id: "4", nome: "Ana Oliveira", email: "ana@email.com", idRep: "1", ativo: true,
            cnpj: '',
            whatsapp: '',
            dataCadastro: ''
          },
          idRep: "1",
          status: "aberto",
        },
        {
          id: "5",
          idCliente: "5",
          data: "2024-01-11T11:55:00Z",
          total: 599.99,
          cliente: {
            id: "5", nome: "Carlos Lima", email: "carlos@email.com", idRep: "1", ativo: true,
            cnpj: '',
            whatsapp: '',
            dataCadastro: ''
          },
          idRep: "1",
          status: "aberto",
        },
      ]

      setRecentOrders(mockOrders)
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Mock chart data
  const monthlyOrdersData = [
    { month: "Jan", pedidos: 45, vendas: 125000 },
    { month: "Fev", pedidos: 52, vendas: 142000 },
    { month: "Mar", pedidos: 48, vendas: 138000 },
    { month: "Abr", pedidos: 61, vendas: 165000 },
    { month: "Mai", pedidos: 55, vendas: 158000 },
    { month: "Jun", pedidos: 67, vendas: 185000 },
  ]

  const dailySalesData = [
    { day: "Seg", vendas: 12000 },
    { day: "Ter", vendas: 15000 },
    { day: "Qua", vendas: 18000 },
    { day: "Qui", vendas: 22000 },
    { day: "Sex", vendas: 25000 },
    { day: "Sáb", vendas: 28000 },
    { day: "Dom", vendas: 20000 },
  ]

  // Calculate metrics
  const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = totalRevenue / recentOrders.length || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-muted h-32 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-muted h-80 rounded-lg"></div>
                <div className="bg-muted h-80 rounded-lg"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo de volta, {user?.nome}! Aqui está um resumo do seu negócio.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentOrders.length}</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">+5% em relação ao mês passado</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Pedidos por Mês
                </CardTitle>
                <CardDescription>Evolução dos pedidos nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pedidos" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Vendas da Semana
                </CardTitle>
                <CardDescription>Vendas diárias dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    <Line type="monotone" dataKey="vendas" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Pedidos Recentes
                </CardTitle>
                <CardDescription>Últimos pedidos recebidos</CardDescription>
              </div>
              <Link href="/dashboard/pedidos">
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.cliente?.nome}</TableCell>
                      <TableCell>{formatDate(order.data)}</TableCell>
                      <TableCell className="font-semibold text-primary">{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Processando</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
