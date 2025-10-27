"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Package, AlertCircle } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart()
  const { user, isAuthenticated, isVendedor } = useAuth()
  const router = useRouter()
  const [observacoes, setObservacoes] = useState("")
  const [loading, setLoading] = useState(false)

  if (!isAuthenticated || isVendedor) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Login Necessário
            </DialogTitle>
            <DialogDescription>Você precisa estar logado como cliente para fazer pedidos.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Para realizar pedidos, você precisa fazer login como cliente. O login é rápido e simples, apenas com nome
              e e-mail.
            </p>

            <Button onClick={() => router.push("/login")} className="w-full">
              Fazer Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert("Seu carrinho está vazio")
      return
    }

    setLoading(true)
    try {
      const idVendedor = "idVendedor" in user ? user.idVendedor : ""

      await pedidoService.create({
        idCliente: user.id,
        idVendedor,
        itens: items.map((item) => ({
          idProduto: item.product.id,
          quantidade: item.quantidade,
          subtotal: item.product.preco * item.quantidade,
        })),
        total,
        observacoes: observacoes || undefined,
      })

      alert("Pedido enviado com sucesso! O vendedor receberá uma notificação no WhatsApp.")
      clearCart()
      onClose()
      router.push("/meus-pedidos")
    } catch (error) {
      console.error("Erro ao enviar pedido:", error)
      alert("Erro ao enviar pedido. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription>Revise seu pedido e adicione observações se necessário</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Seus Dados
            </h3>
            <div className="grid gap-3 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Nome</Label>
                <p className="font-medium">{user.nome}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">E-mail</Label>
                <p className="font-medium">{user.email}</p>
              </div>
              {"telefone" in user && user.telefone && (
                <div>
                  <Label className="text-xs text-muted-foreground">Telefone</Label>
                  <p className="font-medium">{user.telefone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="space-y-3">
            <h3 className="font-semibold">Itens do Pedido</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 border rounded-lg">
                  <img
                    src={item.product.imagem || "/placeholder.svg"}
                    alt={item.product.nome}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantidade} x{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.product.preco)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.product.preco * item.quantidade)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <p className="font-semibold text-lg">Total</p>
              <p className="font-bold text-xl">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(total)}
              </p>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione informações adicionais sobre seu pedido..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Informação sobre notificação */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Ao enviar o pedido, seu vendedor receberá uma notificação automática no WhatsApp e entrará em contato para
              confirmar os detalhes.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
