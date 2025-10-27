"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Smile, Clock, MessageCircle, Box, Truck, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"
import { useCart } from "@/contexts/CartContext"
import { pedidoService } from "@/services/api"
import { PedidoInterface } from '@/app/interfaces/pedido'
import { StatusType } from '@/app/types/statusType'
import { statusConfig } from '@/app/dashboard/pedidos/page'


export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [pedido, setPedido] = useState<PedidoInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCart()

  useEffect(() => {
    if (!params.id) return

    const fetchData = async () => {
      await loadPedido(params.id as string)
      clearCart()
    }

    fetchData()
  }, [params.id])


  const loadPedido = async (id: string) => {
    try {
      setLoading(true)
      const data = await pedidoService.getById(id)
      setPedido(data)
    } catch (error) {
      console.error("Erro ao carregar pedido:", error)
    } finally {
      setLoading(false)
    }
  }


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const qualStatus = (status: StatusType) => {
    if (status === StatusType.pendente) {
      return 'pendente'
    } else if (status === StatusType.aprovado) {
      return 'aprovado'
    } else if (status === StatusType.em_separacao) {
      return 'em_separacao'
    } else if (status === StatusType.enviado) {
      return 'enviado'
    } else if (status === StatusType.entregue) {
      return 'entregue'
    } else if (status === StatusType.em_analise) {
      return 'em_analise'
    } else {
      return 'cancelado'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="bg-muted h-32 rounded-lg"></div>
              <div className="bg-muted h-64 rounded-lg"></div>
              <div className="bg-muted h-48 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Pedido não encontrado</h1>
          <Link href="/">
            <Button>Voltar ao catálogo</Button>
          </Link>
        </div>
      </div>
    )
  }
  const status = statusConfig[pedido.status]
  const StatusIcon = status.icon as React.ComponentType<React.SVGProps<SVGSVGElement>>
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Detalhes do Pedido #{pedido.numeroPedido}</span>
                {(() => {
                  return (
                    <Badge
                      variant={status.variant}
                      className={status.color}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {status.label}
                    </Badge>
                  )
                })()}
              </CardTitle>

            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Data do pedido:</span>
                  <p className="font-medium">{formatDate(pedido.data)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <p className="font-medium">{pedido.cliente?.nome}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">E-mail:</span>
                  <p className="font-medium">{pedido.cliente?.email}</p>
                </div>
              </div>
              <Separator />
              {/* Itens do pedido com preços e totais */}
              <div className="space-y-3">
                <h3 className="font-semibold">Itens do pedido:</h3>
                {pedido.itens?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 justify-between">
                    <div>
                      <p className="font-medium">{item.produto?.nome}</p>
                      <p className="text-sm text-muted-foreground">Quantidade: {item.quantidade}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Preço: {formatPrice(item.preco)}</p>
                      <p className="text-sm">Total: {formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator />
              {/* Totais e desconto */}
              <div className="flex flex-col items-end gap-1">
                {pedido.itens && pedido.itens.length > 1 && (
                  <span className="text-sm text-muted-foreground">Total dos produtos:</span>
                )}
                <span className="text-lg font-bold">SubTotal: {formatPrice(pedido.total)} </span>
                {pedido.desconto && pedido.desconto > 0 && (
                  <span className="text-sm text-green-700 dark:text-green-400">Desconto aplicado: {formatPrice(pedido.desconto)}</span>
                )}
                <span className="text-lg font-bold">Total: {formatPrice(pedido.totalDescontado)} </span>


              </div>

              {/* Card de próximos passos - visual aprimorado */}
              <div className="mt-10">
                <Card className="relative overflow-hidden border-0 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950 dark:via-purple-900 dark:to-pink-900 opacity-80" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Smile className="text-yellow-500 dark:text-yellow-300" />
                      Próximos passos do seu pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex flex-wrap justify-between items-center gap-6 px-2 py-4">
                      {[
                        { key: "pendente", label: "Pendente", icon: Clock, color: "text-yellow-500" },
                        { key: "em_analise", label: "Em análise", icon: MessageCircle, color: "text-blue-500" },
                        { key: "aprovado", label: "Aprovado", icon: CheckCircle, color: "text-green-500" },
                        { key: "em_separacao", label: "Em separação", icon: Box, color: "text-purple-500" },
                        { key: "enviado", label: "Enviado", icon: Truck, color: "text-indigo-500" },
                        { key: "entregue", label: "Entregue", icon: CheckCircle, color: "text-green-600" },
                        { key: "cancelado", label: "Cancelado", icon: XCircle, color: "text-red-500" },
                      ].map((status, i, arr) => {
                        const StatusIcon = status.icon
                        const isActive = qualStatus(pedido.status) === status.key

                        return (
                          <div key={status.key} className="flex flex-col items-center flex-1 min-w-[80px]">
                            {/* Conector de linha */}
                            {i < arr.length - 1 && (
                              <div
                                className={`absolute top-1/2 left-[calc(50%+20px)] right-0 h-[2px] ${isActive ? "bg-foreground/60" : "bg-muted-foreground/20"
                                  }`}
                              />
                            )}

                            {/* Ícone e círculo */}
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${isActive
                                ? `${status.color.replace("text-", "border-")} bg-foreground/10 scale-110`
                                : "border-muted-foreground/30 opacity-50"
                                }`}
                            >
                              <StatusIcon className={`w-5 h-5 ${status.color}`} />
                            </div>

                            {/* Label */}
                            <span
                              className={`mt-2 text-sm font-medium text-center ${isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                              {status.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Status atual destacado */}
                    <div className="mt-6 flex items-center justify-center gap-2 font-semibold text-lg">
                      <Smile className="text-yellow-500" />
                      <span>Status atual:</span>
                      <span className="ml-1 capitalize">
                        {statusConfig[pedido.status].label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button variant="secondary" onClick={() => router.push("/meus-pedidos")}>
                  Voltar para Meus Pedidos
                </Button>
                <Button className="mt-2 sm:mt-0" onClick={() => router.push("/")}>
                  Continuar comprando
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
