"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package, FileText } from "lucide-react"
import { pedidoService, clienteService } from "@/services/api"
import type { Pedido } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useNotification } from "@/contexts/NotificationContext"

const statusConfig = {
  pendente: { label: "Pendente", variant: "secondary" as const, color: "bg-yellow-500" },
  em_analise: { label: "Em Análise", variant: "secondary" as const, color: "bg-blue-500" },
  aprovado: { label: "Aprovado", variant: "default" as const, color: "bg-green-500" },
  em_separacao: { label: "Em Separação", variant: "default" as const, color: "bg-purple-500" },
  enviado: { label: "Enviado", variant: "default" as const, color: "bg-indigo-500" },
  entregue: { label: "Entregue", variant: "default" as const, color: "bg-emerald-500" },
  cancelado: { label: "Cancelado", variant: "destructive" as const, color: "bg-red-500" },
}


export default function PedidosPage() {
  // Utilitário para formatar moeda
  // Aceita string já formatada ou número
  function formatCurrency(value: string | number) {
    if (typeof value === "string" && value.startsWith("R$")) return value
    const num = Number(value)
    if (!isNaN(num)) {
      return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }
    return value as string
  }
  const { user, isVendedor } = useAuth()
  const { addNotification } = useNotification()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  // Estado para modal de orçamento
  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(false)
  const [orcamentoPedido, setOrcamentoPedido] = useState<Pedido | null>(null)
  const [orcamentoItens, setOrcamentoItens] = useState<any[]>([])
  const [descontoValor, setDescontoValor] = useState(0)
  const [descontoPorcentagem, setDescontoPorcentagem] = useState(0)

  useEffect(() => {
    if (isVendedor && user) {
      loadPedidos()
    }
  }, [isVendedor, user])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      const data = await pedidoService.getAll(user!.id)

      // Carregar dados dos clientes
      const pedidosComClientes = await Promise.all(
        data.map(async (pedido) => {
          try {
            const cliente = await clienteService.getById(pedido.idCliente)
            return { ...pedido, cliente }
          } catch {
            return pedido
          }
        }),
      )

      setPedidos(pedidosComClientes)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (pedido: Pedido) => {
    try {
      // Carregar detalhes completos do pedido
      const pedidoCompleto = await pedidoService.getByCliente(pedido.idCliente)
      const pedidoDetalhado = pedidoCompleto.find((p) => p.id === pedido.id)

      if (pedidoDetalhado) {
        setSelectedPedido(pedidoDetalhado)
        setIsDialogOpen(true)
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido:", error)
    }
  }

  const handleUpdateStatus = async (novoStatus: Pedido["status"]) => {
    if (!selectedPedido) return

    try {
      setUpdatingStatus(true)
      await pedidoService.updateStatus(selectedPedido.id, novoStatus)

      // Atualizar lista de pedidos
      await loadPedidos()

      // Atualizar pedido selecionado
      setSelectedPedido({ ...selectedPedido, status: novoStatus })

      // Notificações customizadas por status
      if (novoStatus === "aprovado") {
        addNotification({
          message: `Pedido #${selectedPedido.id} enviado para aprovação do cliente!`,
          type: "info",
          link: `/meus-pedidos?pedido=${selectedPedido.id}`,
          destinatarioId: selectedPedido.idCliente,
          destinatarioTipo: "cliente"
        })
      } else if (novoStatus === "cancelado") {
        addNotification({
          message: `Pedido #${selectedPedido.id} foi cancelado pelo cliente!`,
          type: "warning",
          link: `/dashboard/pedidos?pedido=${selectedPedido.id}`,
          destinatarioId: selectedPedido.idVendedor,
          destinatarioTipo: "vendedor"
        })
      } else if (["em_separacao", "enviado", "entregue"].includes(novoStatus)) {
        addNotification({
          message: `Status do pedido #${selectedPedido.id} atualizado para: ${novoStatus.replace('_', ' ')}!`,
          type: "info",
          link: `/meus-pedidos?pedido=${selectedPedido.id}`,
          destinatarioId: selectedPedido.idCliente,
          destinatarioTipo: "cliente"
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      addNotification({
        message: "Erro ao atualizar status do pedido.",
        type: "error",
        destinatarioId: user?.id || "",
        destinatarioTipo: "vendedor"
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (!isVendedor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Acesso negado. Apenas vendedores podem acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-3xl">Pedidos</h1>
              <p className="text-muted-foreground">Gerencie os pedidos dos seus clientes</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por pedido ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="em_separacao">Em Separação</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando pedidos...</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum pedido encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPedidos.map((pedido) => (
                        <TableRow key={pedido.id}>
                          <TableCell className="font-medium">#{pedido.id}</TableCell>
                          <TableCell>{pedido.cliente?.nome || "Cliente não encontrado"}</TableCell>
                          <TableCell>{new Date(pedido.data).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            {formatCurrency(pedido.total)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig[pedido.status].variant}>
                              {statusConfig[pedido.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => handleViewDetails(pedido)} title="Ver Detalhes">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {pedido.status === "pendente" && (
                              <Button
                                variant="outline"
                                size="icon"
                                title="Fazer Orçamento"
                                onClick={async () => {
                                  // Buscar detalhes completos do pedido
                                  const pedidosDetalhados = await pedidoService.getByCliente(pedido.idCliente)
                                  const pedidoDetalhado = pedidosDetalhados.find((p) => p.id === pedido.id)
                                  if (pedidoDetalhado) {
                                    setOrcamentoPedido(pedidoDetalhado)
                                    setOrcamentoItens(
                                      pedidoDetalhado.itens?.map((item) => ({
                                        ...item,
                                        preco: item.produto?.preco || "R$ 0,00",
                                        quantidade: item.quantidade,
                                        subtotal: item.produto?.preco || "R$ 0,00",
                                      })) || []
                                    )
                                    setDescontoValor(0)
                                    setDescontoPorcentagem(0)
                                    setIsOrcamentoOpen(true)
                                  }
                                }}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                          {/* Modal de Orçamento */}
                          <Dialog open={isOrcamentoOpen} onOpenChange={setIsOrcamentoOpen}>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Orçamento do Pedido #{orcamentoPedido?.id}</DialogTitle>
                                <DialogDescription>
                                  {orcamentoPedido && (
                                    <div className="space-y-2 mt-2">
                                      <div className="flex flex-wrap gap-4">
                                        <span><b>Data:</b> {new Date(orcamentoPedido.data).toLocaleDateString("pt-BR")} {new Date(orcamentoPedido.data).toLocaleTimeString("pt-BR")}</span>
                                        <span><b>Status:</b> <Badge variant={statusConfig[orcamentoPedido.status].variant}>{statusConfig[orcamentoPedido.status].label}</Badge></span>
                                        <span><b>ID:</b> {orcamentoPedido.id}</span>
                                      </div>
                                      <div className="flex flex-wrap gap-4">
                                        <span><b>Cliente:</b> {orcamentoPedido.cliente?.nome}</span>
                                        <span><b>Email:</b> {orcamentoPedido.cliente?.email}</span>
                                        <span><b>WhatsApp:</b> {orcamentoPedido.cliente?.telefone || '-'}</span>
                                      </div>
                                    </div>
                                  )}
                                </DialogDescription>
                              </DialogHeader>
                              {/* Produtos do pedido */}
                              <div className="mt-4">
                                <h3 className="font-semibold mb-2">Produtos</h3>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm border">
                                    <thead>
                                      <tr className="bg-muted">
                                        <th className="p-2 border">Produto</th>
                                        <th className="p-2 border">Quantidade</th>
                                        <th className="p-2 border">Preço (R$)</th>
                                        <th className="p-2 border">Subtotal</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {orcamentoItens.map((item, idx) => (
                                        <tr key={item.id}>
                                          <td className="p-2 border">{item.produto?.nome}</td>
                                          <td className="p-2 border">
                                            <input
                                              type="text"
                                              inputMode="numeric"
                                              value={item.quantidade.toLocaleString("pt-BR")}
                                              onChange={e => {
                                                // Aceita apenas números
                                                const raw = e.target.value.replace(/\D/g, "")
                                                const novaQtd = Number(raw)
                                                setOrcamentoItens(prev => prev.map((it, i) => i === idx ? { ...it, quantidade: novaQtd, subtotal: novaQtd * it.preco } : it))
                                              }}
                                              className="w-16 border rounded px-2 py-1 text-right"
                                            />
                                          </td>
                                          <td className="p-2 border">
                                            <input
                                              type="text"
                                              inputMode="decimal"
                                              value={item.preco}
                                              onChange={e => {
                                                // Aceita valor já formatado
                                                setOrcamentoItens(prev => prev.map((it, i) => i === idx ? { ...it, preco: e.target.value, subtotal: e.target.value } : it))
                                              }}
                                              className="w-24 border rounded px-2 py-1 text-right"
                                            />
                                          </td>
                                          <td className="p-2 border font-semibold">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              {/* Descontos e totais */}
                              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="block font-medium">Desconto em valor (R$)</label>
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    value={descontoValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    onChange={e => {
                                      let raw = e.target.value.replace(/\./g, "").replace(/,/g, ".")
                                      setDescontoValor(Number(raw));
                                      setDescontoPorcentagem(0);
                                    }}
                                    className="w-full border rounded px-2 py-1 text-right"
                                    disabled={descontoPorcentagem > 0}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="block font-medium">Desconto em %</label>
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    value={descontoPorcentagem.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    onChange={e => {
                                      let raw = e.target.value.replace(/\./g, "").replace(/,/g, ".")
                                      setDescontoPorcentagem(Number(raw));
                                      setDescontoValor(0);
                                    }}
                                    className="w-full border rounded px-2 py-1 text-right"
                                    disabled={descontoValor > 0}
                                  />
                                </div>
                              </div>
                              {/* Totais */}
                              <div className="mt-6 flex flex-col gap-2">
                                <div className="flex justify-between">
                                  <span>Total sem desconto:</span>
                                  <span className="font-semibold">{/* Soma não é possível com string, exibe '-' */}-</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Total com desconto:</span>
                                  <span className="font-bold text-primary">
                                    {/* Soma e desconto não são possíveis com string, exibe '-' */}-
                                  </span>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end gap-2">
                                <Button variant="secondary" onClick={() => setIsOrcamentoOpen(false)}>Cancelar</Button>
                                <Button
                                  onClick={() => {
                                    // Aqui você pode implementar a lógica de salvar orçamento
                                    setIsOrcamentoOpen(false)
                                    // Exemplo: notificação
                                    addNotification({
                                      message: `Orçamento salvo para o pedido #${orcamentoPedido?.id}`,
                                      type: "success",
                                      destinatarioId: orcamentoPedido?.idCliente || "",
                                      destinatarioTipo: "cliente"
                                    })
                                  }}
                                  className="bg-primary text-white"
                                >
                                  Salvar Orçamento
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedPedido?.id}</DialogTitle>
            <DialogDescription>
              Pedido realizado em {selectedPedido && new Date(selectedPedido.data).toLocaleDateString("pt-BR")}
            </DialogDescription>
          </DialogHeader>

          {selectedPedido && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedPedido.cliente?.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedPedido.cliente?.email}</p>
                  </div>
                </div>

                {selectedPedido.cliente?.telefone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="font-medium">{selectedPedido.cliente.telefone}</p>
                  </div>
                )}

                {selectedPedido.observacoes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Observações</p>
                    <p className="font-medium">{selectedPedido.observacoes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Itens do Pedido</h3>
                </div>

                <div className="space-y-3">
                  {selectedPedido.itens?.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                      {item.produto?.imagem && (
                        <img
                          src={item.produto.imagem || "/placeholder.svg"}
                          alt={item.produto.nome}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.produto?.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantidade} x{" "}
                          {formatCurrency(item.produto?.preco || "R$ 0,00")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <p className="font-semibold text-lg">Total</p>
                  <p className="font-bold text-xl">
                    {formatCurrency(selectedPedido.total)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium">Atualizar Status do Pedido</p>
                <Select
                  value={selectedPedido.status}
                  onValueChange={(value) => handleUpdateStatus(value as Pedido["status"])}
                  disabled={updatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="em_separacao">Em Separação</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="entregue">Entregue</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  O cliente será notificado automaticamente sobre a mudança de status
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
