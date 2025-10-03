"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Clock, CheckCircle, XCircle, Truck, Box, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"
import type { Pedido } from "@/lib/types"
import { useNotification } from "@/contexts/NotificationContext"

const statusConfig = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "secondary" as const,
  },
  em_analise: {
    label: "Em Análise",
    icon: Package,
    color: "bg-blue-500",
    variant: "default" as const,
  },
  aprovado: {
    label: "Aprovado",
    icon: CheckCircle,
    color: "bg-green-500",
    variant: "default" as const,
  },
  em_separacao: {
    label: "Em Separação",
    icon: Box,
    color: "bg-purple-500",
    variant: "default" as const,
  },
  enviado: {
    label: "Enviado",
    icon: Truck,
    color: "bg-indigo-500",
    variant: "default" as const,
  },
  entregue: {
    label: "Entregue",
    icon: CheckCircle,
    color: "bg-green-600",
    variant: "default" as const,
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive" as const,
  },
}

export default function MeusPedidosPage() {
  const router = useRouter()
  const { user, isAuthenticated, isVendedor } = useAuth()
  const { addNotification } = useNotification()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  // Handlers para ações do cliente
  const handleConfirmar = async (pedido: Pedido) => {
    await pedidoService.updateStatus(pedido.id, "aprovado")
    addNotification({
      message: `Pedido #${pedido.id} confirmado! O vendedor será notificado.`,
      type: "success",
      destinatarioId: pedido.idCliente,
      destinatarioTipo: "cliente"
    })
    addNotification({
      message: `Pedido #${pedido.id} foi confirmado pelo cliente!`,
      type: "info",
      link: `/dashboard/pedidos?pedido=${pedido.id}`,
      destinatarioId: pedido.idVendedor,
      destinatarioTipo: "vendedor"
    })
    setPedidos((prev) => prev.map((p) => p.id === pedido.id ? { ...p, status: "aprovado" } : p))
  }

  const handleCancelar = async (pedido: Pedido) => {
    await pedidoService.updateStatus(pedido.id, "cancelado")
    addNotification({
      message: `Pedido #${pedido.id} cancelado! O vendedor será notificado.`,
      type: "warning",
      destinatarioId: pedido.idCliente,
      destinatarioTipo: "cliente"
    })
    addNotification({
      message: `Pedido #${pedido.id} foi cancelado pelo cliente!`,
      type: "warning",
      link: `/dashboard/pedidos?pedido=${pedido.id}`,
      destinatarioId: pedido.idVendedor,
      destinatarioTipo: "vendedor"
    })
    setPedidos((prev) => prev.map((p) => p.id === pedido.id ? { ...p, status: "cancelado" } : p))
  }

  const handleWhatsApp = (pedido: Pedido) => {
    const message = `Olá! Confirmação do pedido #${pedido.id}:\n\n${pedido.itens
      ?.map((item) => `${item.quantidade}x ${item.produto?.nome} - ${item.subtotal}`)
      .join("\n")}\n\nTotal: ${pedido.total}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  useEffect(() => {
    if (!isAuthenticated || isVendedor) {
      router.push("/login")
      return
    }

    const fetchPedidos = async () => {
      try {
        const data = await pedidoService.getByCliente(user!.id)
        setPedidos(data)
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [isAuthenticated, isVendedor, user, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando seus pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground">Acompanhe o status de todos os seus pedidos</p>
      </div>

      {pedidos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground mb-6">Você ainda não fez nenhum pedido</p>
            <Button onClick={() => router.push("/")}>Ver Produtos</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const status = statusConfig[pedido.status]
            const StatusIcon = status.icon

            // Novo: pode cancelar se NÃO for enviado nem entregue
            const podeCancelar = pedido.status !== "enviado" && pedido.status !== "entregue"

            return (
              <Card key={pedido.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Pedido #{pedido.id}
                        <Badge variant={status.variant} className="ml-2">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>Realizado em {formatDate(pedido.data)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Exibe valores apenas se não for pendente */}
                  {pedido.status !== "pendente" && (
                    <div className="space-y-3 mb-4">
                      {pedido.itens?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          {item.produto && (
                            <>
                              <img
                                src={item.produto.imagem || "/placeholder.svg"}
                                alt={item.produto.nome}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                                <p className="text-sm text-muted-foreground">Quantidade: {item.quantidade}</p>
                                <p className="text-sm text-muted-foreground">Preço: {item.produto.preco}</p>
                                <p className="text-sm text-muted-foreground">Subtotal: {item.subtotal}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {/* Totais e desconto */}
                      <div className="flex flex-col items-end gap-1 mb-2">
                        <span className="text-lg font-bold">Total: {pedido.total}</span>
                        {pedido.desconto && pedido.desconto !== "0%" && (
                          <span className="text-sm text-green-700 dark:text-green-400">Desconto aplicado: {pedido.desconto}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Se status for pendente, mostra apenas nome e quantidade dos produtos */}
                  {pedido.status === "pendente" && (
                    <div className="space-y-3 mb-4">
                      {pedido.itens?.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                          {item.produto && (
                            <>
                              <img
                                src={item.produto.imagem || "/placeholder.svg"}
                                alt={item.produto.nome}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                                <p className="text-sm text-muted-foreground">Quantidade: {item.quantidade}</p>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Total de itens:</span>
                      <span className="font-semibold">
                        {pedido.itens?.reduce((acc, item) => acc + item.quantidade, 0) || 0}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/pedido-confirmado/${pedido.id}`)}
                      disabled={pedido.status === "pendente"}
                    >
                      Ver Detalhes
                    </Button>
                  </div>

                  {/* Botões de ação para status em_analise */}
                  {pedido.status === "em_analise" && (
                    <div className="flex flex-col md:flex-row gap-2 mt-4">
                      <Button variant="default" size="sm" onClick={() => handleConfirmar(pedido)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmar Pedido
                      </Button>
                      {podeCancelar && (
                        <Button variant="destructive" size="sm" onClick={() => handleCancelar(pedido)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancelar Pedido
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleWhatsApp(pedido)}>
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chamar Vendedor no WhatsApp
                      </Button>
                    </div>
                  )}

                  {/* Botão cancelar para outros status permitidos */}
                  {podeCancelar && pedido.status !== "em_analise" && (
                    <div className="flex gap-2 mt-4">
                      <Button variant="destructive" size="sm" onClick={() => handleCancelar(pedido)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancelar Pedido
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}