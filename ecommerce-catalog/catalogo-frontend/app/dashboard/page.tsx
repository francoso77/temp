"use client"

import * as React from "react"; import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, LabelList } from "recharts"
import ClsApi from '../utils/ClsApi'
import { ReceitasInterface } from '../interfaces/dashboard'
import { PedidoInterface } from '../interfaces/pedido'
import { pedidoService } from '@/services/api'
import { statusConfig } from './pedidos/page'

export default function DashboardPage() {
  const { user, isVendedor } = useAuth()
  const router = useRouter()
  const { pathname } = useParams()
  const [recentOrders, setRecentOrders] = useState<ReceitasInterface>({} as ReceitasInterface)
  const [pedidos, setPedidos] = useState<PedidoInterface[]>([])
  const [loading, setLoading] = useState(true)
  const clsApi = new ClsApi()

  useEffect(() => {
    if (!isVendedor) {
      router.push("/login")
      return
    }
    loadDashboardData()
  }, [isVendedor, router, pathname])

  const loadDashboardData = async () => {
    try {

      await clsApi.execute<ReceitasInterface>(
        {
          method: 'post',
          url: 'dashboard',
          idUsuario: user?.idUsuario
        }
      ).then((rs: ReceitasInterface) => {
        if (rs) {
          setRecentOrders(rs)
        } else {
          setRecentOrders({} as ReceitasInterface)
        }
      })

      const agora = new Date()
      const mesAtual = agora.getMonth() // 0–11
      const anoAtual = agora.getFullYear()
      // ====== SEMANA ATUAL ======
      const diaSemana = agora.getDay()
      const diffSegunda = diaSemana === 0 ? -6 : 1 - diaSemana
      const inicioSemana = new Date(anoAtual, mesAtual, agora.getDate() + diffSegunda)
      const fimSemana = new Date(anoAtual, mesAtual, agora.getDate() + (7 - diaSemana))

      const ped = await pedidoService.getAll(user?.idUsuario as string)
      const filtrarPedidos = ped.filter((pedido) => {
        const dataPedido = new Date(pedido.data)
        return dataPedido >= inicioSemana && dataPedido <= fimSemana
      })

      setPedidos(filtrarPedidos)

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
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

  const formatPrice = (price: string | number) => {
    const num = parseBRL(price)
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Calculate metrics
  const totalRevenue = recentOrders.receitaAtual
  const averageOrderValue = recentOrders.ticketAtual

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
        <main className="flex-1 p-2">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground mr-30">
              Bem-vindo de volta, {user?.nomeUsuario}! Aqui está um resumo do seu negócio.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Adicionado o wrapper para limitar a largura em mobile */}
            <div className="max-w-sm mx-auto w-full md:max-w-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">{recentOrders.receitaComparativo.percentualReceita > 0 ?
                    `+${recentOrders.receitaComparativo.percentualReceita}%` : `-${recentOrders.receitaComparativo.percentualReceita}%`} em relação ao mês passado</p>
                </CardContent>
              </Card>
            </div>

            {/* Card 2: Adicionado o wrapper para limitar a largura em mobile */}
            <div className="max-w-sm mx-auto w-full md:max-w-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentOrders.qtdAtual}</div>
                  <p className="text-xs text-muted-foreground">{recentOrders.receitaComparativo.percentualPedidos > 0 ?
                    `+${recentOrders.receitaComparativo.percentualPedidos}%` : `-${recentOrders.receitaComparativo.percentualPedidos}%`} em relação ao mês passado</p>
                </CardContent>
              </Card>
            </div>

            {/* Card 3: Adicionado o wrapper para limitar a largura em mobile */}
            <div className="max-w-sm mx-auto w-full md:max-w-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentOrders.clientesAtual}</div>
                  <p className="text-xs text-muted-foreground">{recentOrders.receitaComparativo.percentualClientes > 0 ?
                    `+${recentOrders.receitaComparativo.percentualClientes}%` : `-${recentOrders.receitaComparativo.percentualClientes}%`} em relação ao mês passado</p>
                </CardContent>
              </Card>
            </div>

            {/* Card 4: Adicionado o wrapper para limitar a largura em mobile */}
            <div className="max-w-sm mx-auto w-full md:max-w-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
                  <p className="text-xs text-muted-foreground">{recentOrders.receitaComparativo.percentualTicket > 0 ?
                    `+${recentOrders.receitaComparativo.percentualTicket}%` : `-${recentOrders.receitaComparativo.percentualTicket}%`} em relação ao mês passado</p>
                </CardContent>
              </Card>
            </div>
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
                  <BarChart data={recentOrders.receitasUltimos6Meses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="vendas" fill="hsl(var(--primary))" />
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
                  <LineChart data={recentOrders.receitaSemana}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />

                    {/* Linha com rótulos acima dos pontos */}
                    <Line
                      type="monotone"
                      dataKey="vendas"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                    >
                      <LabelList
                        dataKey="vendas"
                        position="top"
                        formatter={(label) => label !== undefined ? formatPrice(Number(label)) : ""}
                        fill="hsl(var(--primary))"
                      />
                    </Line>
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
                  {pedidos.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.numeroPedido}</TableCell>
                      <TableCell>{order.cliente?.nome}</TableCell>
                      <TableCell>{formatDate(order.data)}</TableCell>
                      <TableCell className="font-semibold text-primary">{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={statusConfig[order.status].variant}
                          className={statusConfig[order.status].color}
                        >
                          {React.createElement(statusConfig[order.status].icon, {
                            className: "mr-2 h-4 w-4",
                          })}
                          {statusConfig[order.status].label}
                        </Badge>
                      </TableCell>
                      {/* <TableCell>
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
                      </TableCell> */}
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
