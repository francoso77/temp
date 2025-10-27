"use client"
import Image from "next/image"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"
import { useNotification } from "@/contexts/NotificationContext"
import ClsCrud from '@/app/utils/ClsCrudApi'
import { StatusType } from '@/app/types/statusType'
import { DetalhePedidoInterface, PedidoInterface } from '@/app/interfaces/pedido'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const { user, isAuthenticated, vendedorId } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const { addNotification } = useNotification()
  const clsCrud: ClsCrud = new ClsCrud()
  const [formData, setFormData] = useState({
    numeroPedido: "",
    idCliente: "",
    cliente: {
      id: "",
      nome: "",
      email: "",
      telefone: "",
      cnpj: "",
      ativo: true,
      idVendedor: "",
      dataCadastro: ""
    },
    idVendedor: vendedorId,
    data: "",
    total: 0,
    desconto: 0,
    status: StatusType.pendente,
    observacoes: "",
    itens: [
      {
        id: "",
        idPedido: "",
        idProduto: "",
        quantidade: 0,
        preco: 0,
        subtotal: 0,
        produto: {
          id: "",
          nome: "",
          descricao: "",
          preco: 0,
          idCategoria: "",
          idVendedor: vendedorId,
          imagem: "",
          desconto: 0,
          promocao: false,
          maisVendido: false,
          ativo: true,
          caracteristicas: "",
        }
      },
    ]
  })

  const handleSavePedido = async () => {
    if (!isAuthenticated || !user) {
      alert("Você precisa estar logado para salvar o pedido");
      return;
    }

    try {
      const cliente = await clsCrud.pesquisar({
        entidade: "Cliente",
        criterio: { id: user.idUsuario }
      });

      if (!cliente || cliente.length === 0) {
        throw new Error("Cliente não encontrado");
      }

      if (items.length === 0) {
        alert("Carrinho vazio!");
        return;
      }

      const itensPedido: DetalhePedidoInterface[] = items.map((item) => ({
        idProduto: item.produto.id,
        quantidade: item.quantidade,
        preco: item.produto.preco,
        subtotal: item.quantidade * item.produto.preco,
        produto: item.produto,
      }));

      const totalPedido = itensPedido.reduce((acc, i) => acc + i.subtotal, 0);

      const ultimoPedido = await clsCrud.pesquisar({
        entidade: "Pedido",
        criterio: { idVendedor: vendedorId },
        select: ["numeroPedido"],
        campoOrder: ["numeroPedido"],
        tipoOrder: "DESC",
      });

      if (ultimoPedido && ultimoPedido.length > 0) {
        const ultimo = ultimoPedido[0].numeroPedido;
        const proximo = (parseInt(ultimo) + 1).toString().padStart(9, "0");
        formData.numeroPedido = proximo;
      } else {
        formData.numeroPedido = "000000001";
      }

      const novoPedido: Partial<PedidoInterface> = {
        numeroPedido: formData.numeroPedido,
        idCliente: user.idUsuario,
        cliente: cliente[0],
        idVendedor: cliente[0].idVendedor,
        data: new Date().toISOString(),
        total: totalPedido,
        desconto: 0,
        status: StatusType.pendente,
        observacoes: "",
        itens: itensPedido,
      };

      console.log("🛒 Enviando pedido:", novoPedido); // Debug

      await pedidoService.create(novoPedido, user.token);

      if (vendedorId) {
        const zap = await clsCrud.pesquisar({
          entidade: "User",
          criterio: { id: vendedorId },
          select: ["whatsapp"]
        });

        const vendedorWhatsapp = zap.length > 0 ? zap[0].whatsapp : "";

        addNotification({
          message: `Novo pedido pendente recebido!`,
          type: "info",
          link: "/dashboard/pedidos",
          destinatarioId: vendedorId,
          destinatarioTipo: "vendedor",
          pedidoVendedorId: vendedorId,
          pedidoClienteId: user.idUsuario,
          vendedorWhatsapp
        });
      }

      setShowModal(true);
      clearCart();

      setTimeout(() => {
        setShowModal(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
      addNotification({
        message: "Erro ao salvar pedido. Tente novamente.",
        type: "error",
        destinatarioId: user?.idUsuario || "",
        destinatarioTipo: "cliente"
      });
    }
  };

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
                  <div key={item.produto.id} className="flex items-center space-x-3 bg-muted/50 p-3 rounded-lg">
                    <Image
                      src={item.produto.imagem || "/placeholder.svg"}
                      alt={item.produto.nome}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.produto.nome}</h3>

                      {item.produto.promocao && (
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 text-xs mt-1">
                          🎉 PROMOÇÃO
                        </Badge>
                      )}

                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.produto.id, item.quantidade - 1)}
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
                          onClick={() => updateQuantity(item.produto.id, item.quantidade + 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.produto.id)}
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
