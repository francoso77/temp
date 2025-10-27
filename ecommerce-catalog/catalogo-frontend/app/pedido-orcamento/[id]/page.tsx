"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"
import { useNotification } from "@/contexts/NotificationContext"
import { PedidoInterface } from '@/app/interfaces/pedido'
import ClsCrud from '@/app/utils/ClsCrudApi'
import { StatusType } from '@/app/types/statusType'
import { UserInterface } from '@/app/interfaces/sistema/user'
import { URL_BACKEND } from '@/app/utils/Servidor'
import Header from '@/components/Header'
import Condicional from '@/components/Condicional/Condicional'
import { statusConfig } from '@/app/dashboard/pedidos/page'


export default function PedidoOrcamentoPage() {
  const router = useRouter()
  const { id } = useParams()
  const { user, isAuthenticated, isVendedor } = useAuth()
  const { addNotification } = useNotification()
  const [pedido, setPedido] = useState<PedidoInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const clsCrud: ClsCrud = new ClsCrud()

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

  const formatCurrency = (value: number): string =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }).replace(".", ",")

  // Handlers
  const handleConfirmar = async () => {
    if (!pedido) return
    const pedidoAtualizado = { ...pedido, status: StatusType.aprovado }
    await pedidoService.create(pedidoAtualizado, user?.token as string)
    addNotification({
      message: `Pedido #${pedido.numeroPedido} foi confirmado pelo cliente!`,
      type: pedidoAtualizado.status,
      link: `/dashboard/pedidos?pedido=${pedido.id}`,
      destinatarioId: pedido.idVendedor,
      destinatarioTipo: "vendedor"
    })
    setPedido(pedidoAtualizado)
  }

  const handleCancelar = async () => {
    if (!pedido) return
    const pedidoAtualizado = { ...pedido, status: StatusType.cancelado }
    await pedidoService.create(pedidoAtualizado, user?.token as string)
    addNotification({
      message: `Pedido #${pedido.numeroPedido} foi cancelado pelo cliente!`,
      type: pedidoAtualizado.status,
      link: `/dashboard/pedidos?pedido=${pedido.id}`,
      destinatarioId: pedido.idVendedor,
      destinatarioTipo: "vendedor"
    })
    setPedido(pedidoAtualizado)
  }

  const handleZap = async (vendedor: string): Promise<string> => {
    const zap: UserInterface[] = await clsCrud.pesquisar({
      entidade: 'User',
      criterio: { id: vendedor }
    });
    if (!zap || zap.length === 0) return ''
    const raw = zap[0].whatsapp ?? ''
    const zapLimpo = raw.replace(/\D/g, '')
    if (!zapLimpo) return ''
    return zapLimpo.startsWith('55') ? zapLimpo : `55${zapLimpo}`
  }

  const handleWhatsApp = async () => {
    if (!pedido) return
    const message = `Olá! Vamos negociar o pedido #${pedido.numeroPedido}:\n\nTotal: ${pedido.total ?? 0}`
    const numero = await handleZap(pedido.idVendedor)
    if (!numero) {
      console.warn('Número de WhatsApp do vendedor não encontrado.')
      return
    }
    const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  useEffect(() => {
    if (!isAuthenticated || isVendedor) {
      router.push("/login")
      return
    }

    const acertaNomeImagem = async (itens: any[]) => {
      return itens.map((item) => {
        if (!item.produto.imagem.startsWith("http")) {
          item.produto.imagem = `${URL_BACKEND}/uploads/produtos/${item.produto.imagem}`
        }
        return item
      })
    }

    const fetchPedido = async () => {
      try {
        const data = await pedidoService.getById(id as string)
        await acertaNomeImagem(data.itens)
        setPedido(data)
      } catch (error) {
        console.error("Erro ao carregar pedido:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedido()
  }, [id, isAuthenticated, isVendedor, router])

  if (loading) return <p className="text-center py-12">Carregando pedido...</p>
  if (!pedido) return <p className="text-center py-12">Pedido não encontrado</p>

  const status = statusConfig[pedido.status]
  const StatusIcon = status.icon
  const podeCancelar = pedido.status !== StatusType.enviado && pedido.status !== StatusType.entregue

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">Voltar</Button>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Pedido #{pedido.numeroPedido}</CardTitle>
              <CardDescription>Realizado em {formatDate(pedido.data)}</CardDescription>
            </div>
            <Badge variant={status.variant} className={status.color}>
              <StatusIcon className="h-3 w-3" /> {status.label}
            </Badge>
          </CardHeader>

          <CardContent>
            {/* Itens do pedido */}
            {pedido.itens?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg mb-3">
                <img src={item.produto.imagem || "/placeholder.svg"} alt={item.produto.nome} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                  <p className="text-sm text-muted-foreground">Quantidade: {item.quantidade}</p>
                  <Condicional condicao={pedido.status !== StatusType.pendente}>
                    <p className="text-sm text-muted-foreground">Preço: {formatCurrency(item.produto.preco)}</p>
                    <p className="text-sm text-muted-foreground">Subtotal: {formatCurrency(item.subtotal)}</p>
                  </Condicional>
                </div>
              </div>
            ))}

            {/* Totais */}
            <Condicional condicao={pedido.status !== StatusType.pendente}>
              <div className="flex flex-col items-end gap-1 mb-2">
                <span className="text-lg font-bold">Total Bruto: {formatCurrency(pedido.total)}</span>
                <span className="text-sm text-green-700 dark:text-green-400">Desconto: {formatCurrency(pedido.desconto)}</span>
                <span className="text-lg font-bold">Total Líquido: {formatCurrency(pedido.totalDescontado)}</span>
              </div>
            </Condicional>

            {/* Ações */}
            <div className="flex flex-wrap gap-2 mt-4">
              {pedido.status === StatusType.em_analise && (
                <>
                  <Button variant="default" size="sm" onClick={handleConfirmar}>Confirmar</Button>
                  {podeCancelar && <Button variant="destructive" size="sm" onClick={handleCancelar}>Cancelar</Button>}
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleWhatsApp}>WhatsApp</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
