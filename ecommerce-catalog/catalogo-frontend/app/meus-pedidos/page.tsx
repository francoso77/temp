"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Package, Clock, CheckCircle, XCircle, Truck, Box, MessageCircle, ArrowLeft,
  ChevronUp, ChevronDown, Eye, MessageSquare, Search, Trash2, Check
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/AuthContext"
import { pedidoService } from "@/services/api"
import { useNotification } from "@/contexts/NotificationContext"
import { PedidoInterface } from "../interfaces/pedido"
import { StatusType, StatusTypes } from "../types/statusType"
import { Header } from "@/components/Header"
import { URL_BACKEND } from "../utils/Servidor"
import ClsCrud from "../utils/ClsCrudApi"
import { UserInterface } from "../interfaces/sistema/user"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Configuração de Status
const statusConfig = {
  pendente: { label: "Pendente", icon: Clock, color: "bg-yellow-500 hover:bg-yellow-600", variant: "secondary" as const, type: StatusType.pendente },
  em_analise: { label: "Em Análise", icon: MessageCircle, color: "bg-blue-500 hover:bg-blue-600", variant: "default" as const, type: StatusType.em_analise },
  aprovado: { label: "Aprovado", icon: CheckCircle, color: "bg-green-500 hover:bg-green-600", variant: "default" as const, type: StatusType.aprovado },
  em_separacao: { label: "Em Separação", icon: Box, color: "bg-purple-500 hover:bg-purple-600", variant: "default" as const, type: StatusType.em_separacao },
  enviado: { label: "Enviado", icon: Truck, color: "bg-indigo-500 hover:bg-indigo-600", variant: "default" as const, type: StatusType.enviado },
  entregue: { label: "Entregue", icon: CheckCircle, color: "bg-green-600 hover:bg-green-700", variant: "default" as const, type: StatusType.entregue },
  cancelado: { label: "Cancelado", icon: XCircle, color: "bg-red-500 hover:bg-red-600", variant: "destructive" as const, type: StatusType.cancelado },
}

// Mapeamento de StatusType para chave de statusConfig
const qualStatus = (status: StatusType) => {
  const statusKey = Object.keys(statusConfig).find(
    (key) => statusConfig[key as keyof typeof statusConfig].type === status
  )
  return (statusKey || "cancelado") as keyof typeof statusConfig
}

export default function MeusPedidosPage() {
  const router = useRouter()
  const { user, isAuthenticated, isVendedor } = useAuth()
  const { addNotification } = useNotification()
  const [pedidos, setPedidos] = useState<PedidoInterface[]>([])
  const [pedidoSelecionado, setPedidoSelecionado] = useState<PedidoInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusType | null>(null) // Novo estado para filtro de status
  const [sortField, setSortField] = useState<"numeroPedido" | "data" | "total" | "status">("numeroPedido")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const clsCrud: ClsCrud = useMemo(() => new ClsCrud(), []) // Memoizando ClsCrud
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const handleSort = (field: "numeroPedido" | "data" | "total" | "status") => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  useEffect(() => {

  })
  // Filtragem e Ordenação usando useMemo
  const sortedAndFilteredPedidos = useMemo(() => {
    let filtered = [...pedidos]

    // 1. Filtragem por busca e status
    filtered = filtered.filter((p) => {
      const matchesSearch =
        p.numeroPedido.toString().includes(search.trim()) ||
        new Date(p.data).toLocaleDateString("pt-BR").includes(search.trim())
      const matchesStatus =
        !statusFilter || p.status === statusFilter

      return matchesSearch && matchesStatus
    })

    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => p.status === selectedStatus as any)
    }

    // 2. Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      switch (sortField) {
        case "numeroPedido":
          aValue = a.numeroPedido
          bValue = b.numeroPedido
          break
        case "data":
          aValue = new Date(a.data).getTime()
          bValue = new Date(b.data).getTime()
          break
        case "total":
          aValue = a.totalDescontado ?? a.total
          bValue = b.totalDescontado ?? b.total
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [pedidos, search, statusFilter, sortField, sortOrder, selectedStatus])


  // Confirmar pedido (ATUALIZA apenas a lista de pedidos)
  const handleConfirmar = async (pedido: PedidoInterface) => {
    try {
      const pedidoAtualizado = { ...pedido, status: StatusType.aprovado }
      // NOTE: A chamada a 'create' pode estar incorreta, geralmente PUT ou PATCH são usados para atualização.
      // Assumindo que 'create' com o mesmo ID atualiza:
      await pedidoService.create(pedidoAtualizado, user?.token as string)
      addNotification({
        message: `Pedido #${pedido.numeroPedido} foi confirmado pelo cliente!`,
        type: pedidoAtualizado.status,
        link: `/dashboard/pedidos?pedido=${pedido.id}`,
        destinatarioId: pedido.idVendedor,
        destinatarioTipo: "vendedor",
      })
      setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, status: StatusType.aprovado } : p)))
      setPedidoSelecionado((prev) => prev?.id === pedido.id ? { ...prev, status: StatusType.aprovado } : prev)
    } catch (error) {
      console.error("Erro ao confirmar pedido:", error)
    }
  }

  // Cancelar pedido (ATUALIZA apenas a lista de pedidos)
  const handleCancelar = async (pedido: PedidoInterface) => {
    try {
      // NOVA LÓGICA DE PERMISSÃO: Cancelamento permitido SÓ SE status for 'pendente' OU 'em_analise'
      if (pedido.status !== StatusType.pendente && pedido.status !== StatusType.em_analise) {
        alert("O cancelamento só é permitido para pedidos 'Pendente' ou 'Em Análise'.")
        return
      }

      const pedidoAtualizado = { ...pedido, status: StatusType.cancelado }
      await pedidoService.create(pedidoAtualizado, user?.token as string)
      addNotification({
        message: `Pedido #${pedido.numeroPedido} foi cancelado pelo cliente!`,
        type: pedidoAtualizado.status,
        link: `/dashboard/pedidos?pedido=${pedido.id}`,
        destinatarioId: pedido.idVendedor,
        destinatarioTipo: "vendedor",
      })
      setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, status: StatusType.cancelado } : p)))
      setPedidoSelecionado((prev) => prev?.id === pedido.id ? { ...prev, status: StatusType.cancelado } : prev)
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error)
    }
  }

  // Obter número do vendedor para WhatsApp
  const handleZap = async (vendedor: string): Promise<string> => {
    const zap: UserInterface[] = await clsCrud.pesquisar({ entidade: "User", criterio: { id: vendedor } })
    if (!zap || zap.length === 0) return ""
    const raw = zap[0].whatsapp ?? ""
    const zapLimpo = raw.replace(/\D/g, "")
    // Garante o formato com 55 (código do Brasil)
    return zapLimpo ? (zapLimpo.startsWith("55") ? zapLimpo : `55${zapLimpo}`) : ""
  }

  const handleWhatsApp = async (pedido: PedidoInterface) => {
    const numero = await handleZap(pedido.idVendedor)
    if (!numero) {
      console.warn("Número de WhatsApp do vendedor não encontrado.")
      alert("Número de WhatsApp do vendedor não encontrado.")
      return
    }
    const totalFormatado = formatCurrency(pedido.totalDescontado ?? pedido.total).replace(/\s/g, "")
    const message = `Olá! Vamos negociar o pedido #${pedido.numeroPedido}.\n\nTotal: ${totalFormatado}`
    const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  useEffect(() => {
    if (!isAuthenticated || isVendedor) {
      router.push("/login")
      return
    }

    const acertaNomeImagem = async (itens: any[]) => {
      // Se não for um array, retorna
      if (!Array.isArray(itens)) return []
      return itens.map((item) => {
        // Verifica se o item e as propriedades aninhadas existem para evitar erros
        if (item.produto && item.produto.imagem && !item.produto.imagem.startsWith("http")) {
          item.produto.imagem = `${URL_BACKEND}/uploads/produtos/${item.produto.imagem}`
        }
        return item
      })
    }

    const fetchPedidos = async () => {
      setLoading(true)
      try {
        const data = await pedidoService.getByCliente(user?.idUsuario as string)
        const pedidosComImagens = await Promise.all(
          data.map(async (pedido) => {
            // O mapeamento da imagem deve ser feito no item, não no pedido
            if (pedido.itens) {
              pedido.itens = await acertaNomeImagem(pedido.itens)
            }
            return pedido
          })
        )
        setPedidos(pedidosComImagens)
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [isAuthenticated, isVendedor, user, router]) // Dependências corrigidas

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

  const formatCurrency = (value: number | undefined | null): string => {
    const safeValue = value ?? 0
    return safeValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 })
  }


  if (loading) return <p className="text-center py-12 text-lg text-primary">Carregando pedidos...</p>

  // Renderização
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground mb-6">Acompanhe o status de seus pedidos</p>

        {/* CONTROLES DE PESQUISA E FILTRO */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Campo de pesquisa aprimorado com ícone */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Pesquisar por número do pedido ou data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Seletor de status para pesquisa */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              {StatusTypes.map((status) => (
                <SelectItem key={status.idStatus} value={status.idStatus as any}>
                  <div className="flex items-center gap-2">
                    {/* <status.icon className={`h-4 w-4 ${status.color.replace('bg-', 'text-')}`} /> */}
                    {status.descricao}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TABELA RESPONSIVA */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos ({sortedAndFilteredPedidos.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Versão Desktop (Tabela padrão) */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    {["numeroPedido", "data", "total", "status"].map((field) => (
                      <TableHead key={field} onClick={() => handleSort(field as any)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center">
                          {field === "numeroPedido" && "Número"}
                          {field === "data" && "Data"}
                          {field === "total" && "Total"}
                          {field === "status" && "Status"}
                          {sortField === field && (sortOrder === "asc" ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />)}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAndFilteredPedidos.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">Nenhum pedido encontrado.</TableCell></TableRow>
                  ) : (
                    sortedAndFilteredPedidos.map((pedido) => {
                      const status = statusConfig[qualStatus(pedido.status)]
                      const StatusIcon = status.icon
                      // NOVO: Ação de Cancelar só é permitida se status for 'pendente' OU 'em_analise'
                      const podeCancelar = pedido.status === StatusType.pendente || pedido.status === StatusType.em_analise

                      return (
                        <TableRow key={pedido.id}>
                          <TableCell className="font-medium">#{pedido.numeroPedido}</TableCell>
                          <TableCell>{formatDate(pedido.data)}</TableCell>
                          <TableCell>{formatCurrency(pedido.totalDescontado ?? pedido.total)}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className={`flex items-center gap-1 w-fit ${status.color} text-white`}>
                              <StatusIcon className="h-3 w-3" /> {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              {/* Botão de Visualizar Orçamento (Ícone) */}
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => router.push(`/pedido-orcamento/${pedido.id}`)}
                                title="Visualizar Orçamento"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {/* Botão de Detalhes Confirmados (Ícone) */}
                              <Button
                                size="icon"
                                variant="default"
                                onClick={() => router.push(`/pedido-confirmado/${pedido.id}`)}
                                disabled={pedido.status === StatusType.pendente || pedido.status === StatusType.em_analise}
                                title="Detalhes do Pedido Confirmado"
                              >
                                <Check className="h-4 w-4" />
                              </Button>

                              {/* Botão de Cancelar (Ícone) */}
                              {podeCancelar && (
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => handleCancelar(pedido)}
                                  title="Cancelar Pedido"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Versão Mobile (Lista de Cards/Itens) */}
            <div className="md:hidden p-4 space-y-4">
              {sortedAndFilteredPedidos.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Nenhum pedido encontrado.</p>
              ) : (
                sortedAndFilteredPedidos.map((pedido) => {
                  const status = statusConfig[qualStatus(pedido.status)]
                  const StatusIcon = status.icon
                  // NOVO: Ação de Cancelar só é permitida se status for 'pendente' OU 'em_analise'
                  const podeCancelar = pedido.status === StatusType.pendente || pedido.status === StatusType.em_analise

                  return (
                    <div key={pedido.id} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">Pedido #{pedido.numeroPedido}</h3>
                        <Badge variant={status.variant} className={`flex items-center gap-1 ${status.color} text-white`}>
                          <StatusIcon className="h-3 w-3" /> {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">Data: {formatDate(pedido.data)}</p>
                      <p className="text-base font-bold mb-3">Total: {formatCurrency(pedido.totalDescontado ?? pedido.total)}</p>

                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/pedido-orcamento/${pedido.id}`)}
                          title="Visualizar Orçamento"
                        >
                          <Eye className="h-4 w-4 mr-2" /> Orçamento
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => router.push(`/pedido-confirmado/${pedido.id}`)}
                          disabled={pedido.status === StatusType.pendente || pedido.status === StatusType.em_analise}
                          title="Detalhes do Pedido Confirmado"
                        >
                          <Check className="h-4 w-4 mr-2" /> Detalhes
                        </Button>
                        {podeCancelar && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelar(pedido)}
                            title="Cancelar Pedido"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do pedido selecionado (Mantido) */}
        {pedidoSelecionado && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Pedido #{pedidoSelecionado.numeroPedido}</CardTitle>
                <CardDescription>Realizado em {formatDate(pedidoSelecionado.data)}</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setPedidoSelecionado(null)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
            </CardHeader>
            <CardContent>
              {/* Itens do pedido */}
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {pedidoSelecionado.itens?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <img src={item.produto.imagem || "/placeholder.svg"} alt={item.produto.nome} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                      <p className="text-xs text-muted-foreground">Qtde: {item.quantidade}</p>
                      <p className="text-xs text-muted-foreground">Preço: {formatCurrency(item.produto.preco)}</p>
                      <p className="text-sm font-medium">Subtotal: {formatCurrency(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Totais */}
              <div className="flex flex-col items-end gap-1 mb-4 border-t pt-4">
                <span className="text-base text-muted-foreground">Total Bruto: {formatCurrency(pedidoSelecionado.total)}</span>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">Desconto: {formatCurrency(pedidoSelecionado.desconto)}</span>
                <span className="text-xl font-bold text-primary">Total Líquido: {formatCurrency(pedidoSelecionado.totalDescontado)}</span>
              </div>
              {/* Ações */}
              <div className="flex flex-wrap gap-2 mt-4">
                {pedidoSelecionado.status === StatusType.em_analise && (
                  <>
                    <Button variant="default" size="sm" onClick={() => handleConfirmar(pedidoSelecionado)}>
                      <Check className="h-4 w-4 mr-2" /> Confirmar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleCancelar(pedidoSelecionado)}>
                      <Trash2 className="h-4 w-4 mr-2" /> Cancelar
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => handleWhatsApp(pedidoSelecionado)}>
                  <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}