"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Smile, Hourglass, ClipboardCheck, Package, Truck, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"
import type { Pedido } from "@/lib/types"
import { useCart } from "@/contexts/CartContext"
import { useNotification } from "@/contexts/NotificationContext"
import { pedidoService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCart()
  const { addNotification } = useNotification()
  const { user } = useAuth()

  useEffect(() => {
    if (params.id) {
      loadPedido(params.id as string)
      clearCart() // Clear cart after successful order
    }
  }, [params.id, clearCart])

  const loadPedido = async (id: string) => {
    try {
      // Mock implementation - in real app would call pedidoService.getById(id)
      const mockPedido: Pedido = {
        id,
        idCliente: "1",
        idVendedor: "1",
        data: new Date().toISOString(),
        total: "R$ 2.799,98",
        status: "pendente",
        cliente: {
          id: "1",
          nome: "João Silva",
          email: "joao@email.com",
          telefone: "11999999999",
          ativo: true,
          idVendedor: "1",
          dataCadastro: new Date().toISOString(),
        },
        itens: [
          {
            id: "1",
            idPedido: id,
            idProduto: "1",
            quantidade: 1,
            subtotal: "R$ 2.499,99",
            produto: {
              id: "1",
              nome: "Smartphone Galaxy S24",
              descricao: "Smartphone Samsung Galaxy S24 com 128GB",
              preco: "R$ 2.499,99",
              idCategoria: "1",
              idVendedor: "1",
              imagem: "/modern-smartphone.png",
              ativo: true,
            },
          },
          {
            id: "2",
            idPedido: id,
            idProduto: "3",
            quantidade: 1,
            subtotal: "R$ 299,99",
            produto: {
              id: "3",
              nome: "Fone Bluetooth JBL",
              descricao: "Fone de ouvido JBL sem fio com cancelamento de ruído",
              preco: "R$ 299,99",
              idCategoria: "2",
              idVendedor: "1",
              imagem: "/diverse-people-listening-headphones.png",
              ativo: true,
            },
          },
        ],
      }

      setPedido(mockPedido)
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

  const handleWhatsApp = () => {
    if (!pedido) return

    const message = `Olá! Confirmação do pedido #${pedido.id}:\n\n${pedido.itens
      ?.map((item) => `${item.quantidade}x ${item.produto?.nome} - ${item.subtotal}`)
      .join("\n")}\n\nTotal: ${pedido.total}\n\nData: ${formatDate(pedido.data)}`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmail = () => {
    if (!pedido) return

    const subject = `Confirmação do Pedido #${pedido.id}`
    const body = `Olá!\n\nConfirmação do seu pedido:\n\nPedido: #${pedido.id}\nData: ${formatDate(
      pedido.data,
    )}\n\nItens:\n${pedido.itens
      ?.map((item) => `${item.quantidade}x ${item.produto?.nome} - ${item.subtotal}`)
      .join("\n")}\n\nTotal: ${pedido.total}\n\nObrigado pela preferência!`

    const mailtoUrl = `mailto:${pedido.cliente?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  // Funções de ação do cliente
  const handleConfirmar = async () => {
    if (!pedido) return
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
    setPedido({ ...pedido, status: "aprovado" })
  }
  const handleCancelar = async () => {
    if (!pedido) return
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
    setPedido({ ...pedido, status: "cancelado" })
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pedido #{pedido.id}</CardTitle>
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
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">{pedido.status}</Badge>
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
                      <p className="text-sm">Preço: {item.produto?.preco}</p>
                      <p className="text-sm">Subtotal: {item.subtotal}</p>
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
                <span className="text-lg font-bold">Total: {pedido.total}</span>
                {pedido.desconto && pedido.desconto !== "0%" && (
                  <span className="text-sm text-green-700 dark:text-green-400">Desconto aplicado: {pedido.desconto}</span>
                )}
              </div>

              {/* Card de próximos passos - agora mais alegre e abaixo dos detalhes */}
              <div className="mt-8">
                <Card className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Smile className="text-yellow-500 dark:text-yellow-300" />
                      Próximos passos do seu pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-base">
                      <li className="flex items-center gap-2">
                        <Hourglass className="text-yellow-500" />
                        <span>Pendente: aguardando análise do vendedor</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <ClipboardCheck className="text-blue-500" />
                        <span>Em análise: vendedor pode ajustar valores</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Package className="text-purple-500" />
                        <span>Aprovado: pedido aguardando separação</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Package className="text-pink-500" />
                        <span>Em separação: preparando para entrega</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Truck className="text-indigo-500" />
                        <span>Enviado: pedido a caminho</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" />
                        <span>Entregue: pedido finalizado</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <XCircle className="text-red-500" />
                        <span>Cancelado: pedido cancelado</span>
                      </li>
                    </ul>
                    <div className="mt-4 font-semibold flex items-center gap-2">
                      <Smile className="text-yellow-500" />
                      Status atual:
                      <span className="ml-1">{pedido.status}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <Button variant="secondary" onClick={() => router.push("/meus-pedidos")}>
                  Voltar para Meus Pedidos
                </Button>
                <Button className="mt-2 sm:mt-0" onClick={() => window.location.href = "/produtos"}>
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
