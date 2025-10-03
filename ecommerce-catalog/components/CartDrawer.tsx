"use client"
import Image from "next/image"
import { X, Plus, Minus, ShoppingBag, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"
import { useNotification } from "@/contexts/NotificationContext"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const { addNotification } = useNotification()

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de fazer um pedido:\n\n${items
      .map((item) => `${item.quantidade}x ${item.product.nome}`)
      .join("\n")}\n\nPor favor, me envie o orçamento!`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmail = () => {
    const subject = "Pedido do Catálogo"
    const body = `Olá!\n\nGostaria de fazer um pedido:\n\n${items
      .map((item) => `${item.quantidade}x ${item.product.nome}`)
      .join("\n")}\n\nPor favor, me envie o orçamento!\n\nAguardo retorno!`

    const mailtoUrl = `mailto:vendas@catalogo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  const handleSavePedido = async () => {
    if (!isAuthenticated || !user) {
      alert("Você precisa estar logado para salvar o pedido")
      return
    }
    try {
      // Assumindo que todos os produtos do carrinho pertencem ao mesmo vendedor
      const idVendedor = items[0]?.product.idVendedor
      await pedidoService.create({
        idCliente: user.id,
        idVendedor,
        itens: items.map((item) => ({
          idProduto: item.product.id,
          quantidade: item.quantidade,
          subtotal: 0,
        })),
        total: 0,
      })
      if (idVendedor) {
        // Mock: vendedor WhatsApp fixo para idVendedor = "1"
        const vendedorWhatsapp = idVendedor === "1" ? "11999999999" : ""
        addNotification({
          message: `Novo pedido pendente recebido!`,
          type: "info",
          link: "/dashboard/pedidos",
          destinatarioId: idVendedor,
          destinatarioTipo: "vendedor",
          pedidoVendedorId: idVendedor,
          pedidoClienteId: user.id,
          vendedorWhatsapp
        })
      }
      setShowModal(true)
      clearCart()
      setTimeout(() => {
        setShowModal(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Erro ao salvar pedido:", error)
      addNotification({
        message: "Erro ao salvar pedido. Tente novamente.",
        type: "error",
        destinatarioId: user?.id || "",
        destinatarioTipo: "cliente"
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Carrinho de Compras</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
                    <Image
                      src={item.product.imagem || "/placeholder.svg"}
                      alt={item.product.nome}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.product.nome}</h3>

                      {item.product.promocao && (
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 text-xs mt-1">
                          🎉 PROMOÇÃO
                        </Badge>
                      )}

                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantidade - 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <Badge variant="secondary" className="px-2">
                          {item.quantidade}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantidade + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive h-6 px-2 ml-auto"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total de itens:</span>
                <span className="text-lg font-bold text-primary">
                  {items.reduce((acc, item) => acc + item.quantidade, 0)}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                {isAuthenticated && (
                  <Button onClick={handleSavePedido} variant="secondary" className="w-full">
                    Enviar Orçamento
                  </Button>
                )}
                {showModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
                      <h2 className="text-xl font-bold mb-2 text-primary">Pedido enviado!</h2>
                      <p className="mb-2">Seu pedido foi enviado com status <b>pendente</b>.</p>
                      <p className="text-muted-foreground text-sm">O vendedor receberá uma notificação via WhatsApp.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
