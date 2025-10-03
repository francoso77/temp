"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Minus, X, ShoppingBag, MessageCircle, Mail, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de fazer um pedido:\n\n${items
      .map((item) => `${item.quantidade}x ${item.product.nome}`)
      .join("\n")}\n\nPor favor, me envie o orçamento!`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // const handleEmail = () => {
  //   const subject = "Pedido do Catálogo"
  //   const body = `Olá!\n\nGostaria de fazer um pedido:\n\n${items
  //     .map((item) => `${item.quantidade}x ${item.product.nome}`)
  //     .join("\n")}\n\nPor favor, me envie o orçamento!\n\nAguardo retorno!`

  //   const mailtoUrl = `mailto:vendas@catalogo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  //   window.open(mailtoUrl)
  // }

  const handleSavePedido = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login")
      return
    }

    setLoading(true)
    try {
      const pedido = await pedidoService.create({
        idCliente: user.id,
        itens: items.map((item) => ({
          idProduto: item.product.id,
          quantidade: item.quantidade,
          subtotal: 0,
        })),
        total: 0,
      })

      router.push(`/pedido-confirmado/${pedido.id}`)
    } catch (error) {
      console.error("Erro ao salvar pedido:", error)
      alert("Erro ao salvar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Que tal dar uma olhada em nossos produtos e encontrar algo especial?
            </p>
            <Link href="/">
              <Button size="lg">Continuar comprando</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar comprando
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Lista de Produtos</span>
                  <Badge variant="secondary">{items.length} itens</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.product.id}>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={item.product.imagem || "/placeholder.svg"}
                          alt={item.product.nome}
                          width={80}
                          height={80}
                          className="rounded-md object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/produto/${item.product.id}`}
                          className="font-medium text-foreground hover:text-primary line-clamp-2 text-balance"
                        >
                          {item.product.nome}
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.product.categoria}</p>
                        <div className="flex gap-2 mt-1">
                          {item.product.desconto && item.product.desconto > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{item.product.desconto}% OFF
                            </Badge>
                          )}
                          {item.product.promocao && (
                            <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 text-xs">
                              🎉 PROMOÇÃO
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                          className="h-8 w-8 p-0 bg-transparent"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <Input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) =>
                            updateQuantity(item.product.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                          }
                          className="w-16 text-center h-8"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                          className="h-8 w-8 p-0 bg-transparent"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {item.quantidade} {item.quantidade === 1 ? "unidade" : "unidades"}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive mt-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Lista</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de itens</span>
                  <span className="font-medium">{items.reduce((acc, item) => acc + item.quantidade, 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produtos únicos</span>
                  <span className="font-medium">{items.length}</span>
                </div>

                <Separator />

                <div className="text-center bg-muted p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    💰 Solicite seu orçamento personalizado através dos botões abaixo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleWhatsApp} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Solicitar Orçamento via WhatsApp
              </Button>

              {/*<Button onClick={handleEmail} variant="outline" className="w-full bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Solicitar Orçamento por E-mail
              </Button>*/}

              <Button
                onClick={handleSavePedido}
                disabled={loading}
                className="w-full"
                variant={isAuthenticated ? "default" : "secondary"}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading ? "Salvando..." : isAuthenticated ? "Salvar Lista" : "Fazer Login para Salvar"}
              </Button>
            </div>

            {!isAuthenticated && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Não tem uma conta?</p>
                <Link href="/cadastro">
                  <Button variant="outline" size="sm">
                    Criar conta rápida
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
