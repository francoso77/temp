"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, MessageCircle, Mail, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"
import type { Pedido } from "@/lib/types"
import { useCart } from "@/contexts/CartContext"

export default function OrderConfirmationPage() {
  const params = useParams()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCart()

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
        data: new Date().toISOString(),
        total: 2799.98,
        cliente: {
          id: "1",
          nome: "João Silva",
          email: "joao@email.com",
        },
        itens: [
          {
            id: "1",
            idPedido: id,
            idProduto: "1",
            quantidade: 1,
            subtotal: 2499.99,
            produto: {
              id: "1",
              nome: "Smartphone Galaxy S24",
              descricao: "Smartphone Samsung Galaxy S24 com 128GB",
              preco: 2499.99,
              categoria: "Eletrônicos",
              imagem: "/modern-smartphone.png",
            },
          },
          {
            id: "2",
            idPedido: id,
            idProduto: "3",
            quantidade: 1,
            subtotal: 299.99,
            produto: {
              id: "3",
              nome: "Fone Bluetooth JBL",
              descricao: "Fone de ouvido JBL sem fio com cancelamento de ruído",
              preco: 299.99,
              categoria: "Áudio",
              imagem: "/diverse-people-listening-headphones.png",
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
      ?.map((item) => `${item.quantidade}x ${item.produto?.nome} - ${formatPrice(item.subtotal)}`)
      .join("\n")}\n\nTotal: ${formatPrice(pedido.total)}\n\nData: ${formatDate(pedido.data)}`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // const handleEmail = () => {
  //   if (!pedido) return

  //   const subject = `Confirmação do Pedido #${pedido.id}`
  //   const body = `Olá!\n\nConfirmação do seu pedido:\n\nPedido: #${pedido.id}\nData: ${formatDate(
  //     pedido.data,
  //   )}\n\nItens:\n${pedido.itens
  //     ?.map((item) => `${item.quantidade}x ${item.produto?.nome} - ${formatPrice(item.subtotal)}`)
  //     .join("\n")}\n\nTotal: ${formatPrice(pedido.total)}\n\nObrigado pela preferência!`

  //   const mailtoUrl = `mailto:${pedido.cliente?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  //   window.open(mailtoUrl)
  // }

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
          {/* Success Header */}
          <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Pedido Confirmado!</h1>
              <p className="text-muted-foreground mb-4">
                Seu pedido foi recebido e está sendo processado. Você receberá atualizações em breve.
              </p>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Pedido #{pedido.id}
              </Badge>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Detalhes do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Badge variant="secondary">Processando</Badge>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold">Itens do pedido:</h3>
                {pedido.itens?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.produto?.nome}</p>
                      <p className="text-sm text-muted-foreground">Quantidade: {item.quantidade}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(pedido.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleWhatsApp} className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Compartilhar no WhatsApp
              </Button>

              {/* <Button onClick={handleEmail} variant="outline" className="bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Enviar por E-mail
              </Button> */}
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Baixar Comprovante (PDF)
            </Button>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Confirmação do pedido</p>
                  <p className="text-sm text-muted-foreground">Seu pedido foi recebido e confirmado</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Processamento</p>
                  <p className="text-sm text-muted-foreground">Preparando seus itens para envio</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Envio</p>
                  <p className="text-sm text-muted-foreground">Você receberá o código de rastreamento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <div className="text-center mt-8">
            <Link href="/">
              <Button size="lg">
                Continuar comprando
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
