"use client"

import * as React from "react"; import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Clock, CheckCircle, XCircle, Truck, Box, MessageCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Package, FileText, X } from "lucide-react"
import { pedidoService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useNotification } from "@/contexts/NotificationContext"
import { DetalhePedidoInterface, PedidoInterface } from '@/app/interfaces/pedido'
import { StatusType } from '@/app/types/statusType'
import { URL_BACKEND } from '@/app/utils/Servidor'
import Condicional from '@/components/Condicional/Condicional'

// 1. Configuração de Status (mantida)

export const statusConfig: Record<
  StatusType,
  {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    variant: "default" | "secondary" | "destructive";
    color: string
  }
> = {
  [StatusType.pendente]: { label: "Pendente", icon: Clock, color: "bg-yellow-500", variant: "secondary" as const },
  [StatusType.em_analise]: { label: "Em Análise", icon: MessageCircle, color: "bg-blue-500", variant: "default" as const },
  [StatusType.aprovado]: { label: "Aprovado", icon: CheckCircle, color: "bg-green-500", variant: "default" as const },
  [StatusType.em_separacao]: { label: "Em Separação", icon: Box, color: "bg-purple-500", variant: "default" as const },
  [StatusType.enviado]: { label: "Enviado", icon: Truck, color: "bg-indigo-500", variant: "default" as const },
  [StatusType.entregue]: { label: "Entregue", icon: CheckCircle, color: "bg-green-600", variant: "default" as const },
  [StatusType.cancelado]: { label: "Cancelado", icon: XCircle, color: "bg-red-500", variant: "destructive" as const },
}


// 2. Funções de Formatação (mantidas)
const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(".", ",")
}

const formatCurrencyBR = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).replace(".", ",")
}

// Função de acerto de imagem (mantida)
const acertaNomeImagem = async (itens: any[]) => {
  return itens.map((item) => {
    if (!item.produto.imagem.startsWith("http")) {
      item.produto.imagem = `${URL_BACKEND}/uploads/produtos/${item.produto.imagem}`
    }
    return item
  })
}


/**
 * 3. Componente do Modal de Detalhes do Pedido
 * Separado para isolar o Dialog.
 */
interface DetalhesPedidoDialogProps {
  pedido: PedidoInterface | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (novoStatus: StatusType) => Promise<void>;
  updatingStatus: boolean;
  formatCurrencyBR: (value: number) => string;
}

const DetalhesPedidoDialog = ({
  pedido,
  isOpen,
  onOpenChange,
  onUpdateStatus,
  updatingStatus,
  formatCurrencyBR,
}: DetalhesPedidoDialogProps) => {

  if (!pedido) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalhes do Pedido #{pedido.numeroPedido}
          </DialogTitle>

          <DialogDescription>
            Pedido realizado em{" "}
            {new Date(pedido.data).toLocaleDateString("pt-BR")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                <p className="font-medium">{pedido.cliente?.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{pedido.cliente?.email}</p>
              </div>
            </div>

            {pedido.cliente?.telefone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                <p className="font-medium">{pedido.cliente.telefone}</p>
              </div>
            )}

            {pedido.observacoes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Observações</p>
                <p className="font-medium">{pedido.observacoes}</p>
              </div>
            )}
          </div>

          {/* Itens */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Itens do Pedido</h3>
            </div>

            <div className="space-y-3">
              {pedido.itens?.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border rounded-lg">
                  <img
                    src={item.produto?.imagem || "/placeholder.svg"}
                    alt={item.produto?.nome || "Produto"}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.produto?.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantidade: {item.quantidade} x {formatCurrencyBR(item.preco)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrencyBR(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="flex justify-between items-center pt-3 border-t">
              <p className="font-semibold text-lg">Subtotal</p>
              <p className="font-bold text-xl">
                {formatCurrencyBR(pedido.total)}
              </p>
            </div>

            <div className="flex justify-between items-center pt-1 border-t">
              <p className="font-semibold text-lg">Desconto</p>
              <p className="font-semibold text-sm text-red-600">
                {formatCurrencyBR(pedido.desconto)}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <p className="font-semibold text-lg">Total</p>
              <p className="font-bold text-xl">
                {formatCurrencyBR(pedido.totalDescontado)}
              </p>
            </div>
          </div>

          {/* Atualização de status */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Atualizar Status do Pedido</p>
            <Select
              value={String(pedido.status)}
              onValueChange={(value) =>
                onUpdateStatus(Number(value) as StatusType)
              }
              disabled={updatingStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(StatusType)
                  .filter(([_, val]) => !isNaN(Number(val)))
                  .map(([key, val]) => (
                    <SelectItem key={val} value={String(val)}>
                      {statusConfig[val as StatusType].label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              O cliente será notificado automaticamente sobre a mudança de status.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


/**
 * 4. Componente do Modal de Orçamento
 * Separado para isolar o Dialog e a lógica de descontos/itens.
 */
interface ItemOrcamento extends DetalhePedidoInterface {
  precoInput?: string; // Para controlar o input de preço como string
}

interface OrcamentoPedidoDialogProps {
  orcamentoPedido: PedidoInterface | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pedido: PedidoInterface, itens: ItemOrcamento[]) => Promise<void>;
  formatCurrency: (value: number) => string;
  formatCurrencyBR: (value: number) => string;
}

const OrcamentoPedidoDialog = ({
  orcamentoPedido,
  isOpen,
  onOpenChange,
  onSave,
  formatCurrency,
  formatCurrencyBR,
}: OrcamentoPedidoDialogProps) => {

  const { addNotification } = useNotification()
  const [orcamentoItens, setOrcamentoItens] = useState<ItemOrcamento[]>([])
  const [descontoValor, setDescontoValor] = useState(0)
  const [descontoPorcentagem, setDescontoPorcentagem] = useState(0)
  const [descontoValorInput, setDescontoValorInput] = useState("")
  const [descontoPorcentagemInput, setDescontoPorcentagemInput] = useState("")

  const [totais, setTotais] = useState({
    total: 0,
    desconto: 0,
    totalDescontado: 0,
  })

  // Efeito para carregar dados iniciais e formatar inputs
  useEffect(() => {
    if (orcamentoPedido && isOpen) {
      const initialItens = orcamentoPedido.itens.map((item) => ({
        ...item,
        preco: item.preco * 1,
        quantidade: item.quantidade,
        subtotal: item.quantidade * item.preco,
        precoInput: formatCurrency(item.preco * 1), // Inicializa o input de preço
      })) as ItemOrcamento[]

      setOrcamentoItens(initialItens)

      // Determinar qual desconto aplicar (valor tem prioridade no código original)
      const initialDescontoValor = orcamentoPedido.desconto || 0
      const initialDescontoPorcentagem = 0 // A porcentagem não estava sendo salva separadamente, zera

      setDescontoValor(initialDescontoValor)
      setDescontoPorcentagem(initialDescontoPorcentagem)

      setDescontoValorInput(formatCurrency(initialDescontoValor))
      setDescontoPorcentagemInput(formatCurrency(initialDescontoPorcentagem))
    } else {
      // Resetar estados ao fechar
      setDescontoValor(0);
      setDescontoPorcentagem(0);
      setOrcamentoItens([]);
    }
  }, [orcamentoPedido, isOpen, formatCurrency])


  // Efeito para recalcular totais
  useEffect(() => {
    const totalSemDesconto = orcamentoItens.reduce(
      (acc, item) => acc + (item.subtotal || 0),
      0
    );
    let valorDesconto = 0;
    let totalComDesconto = totalSemDesconto;

    if (descontoValor > 0) {
      valorDesconto = descontoValor;
      totalComDesconto -= valorDesconto;
    } else if (descontoPorcentagem > 0) {
      valorDesconto = totalSemDesconto * (descontoPorcentagem / 100);
      totalComDesconto -= valorDesconto;
    }

    if (totalComDesconto < 0) totalComDesconto = 0;

    setTotais({
      total: totalSemDesconto,
      desconto: valorDesconto,
      totalDescontado: totalComDesconto,
    });
  }, [orcamentoItens, descontoValor, descontoPorcentagem]);


  // Lógica de manipulação para Desconto em Valor
  const handleValorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescontoValorInput(e.target.value);
  }, []);

  const handleValorBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const valorDigitado = e.target.value;
    const raw = valorDigitado.replace(/\./g, "").replace(",", ".");
    const valorNumerico = parseFloat(raw) || 0;

    setDescontoValor(valorNumerico);
    const valorFormatado = formatCurrency(valorNumerico);
    setDescontoValorInput(valorFormatado);

    if (valorNumerico > 0) {
      setDescontoPorcentagem(0);
      setDescontoPorcentagemInput(formatCurrency(0));
    }
  }, [formatCurrency]);


  // Lógica de manipulação para Desconto em Porcentagem
  const handlePorcentagemChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescontoPorcentagemInput(e.target.value);
  }, []);

  const handlePorcentagemBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const valorDigitado = e.target.value;
    const raw = valorDigitado.replace(/\./g, "").replace(",", ".");
    const valorNumerico = parseFloat(raw) || 0;

    setDescontoPorcentagem(valorNumerico);
    const valorFormatado = formatCurrency(valorNumerico);
    setDescontoPorcentagemInput(valorFormatado);

    if (valorNumerico > 0) {
      setDescontoValor(0);
      setDescontoValorInput(formatCurrency(0));
    }
  }, [formatCurrency]);


  const handleSaveOrcamento = () => {
    if (!orcamentoPedido) return;

    // Criar uma cópia do pedido com os novos totais
    const pedidoAtualizado: PedidoInterface = {
      ...orcamentoPedido,
      total: totais.total,
      desconto: totais.desconto,
      totalDescontado: totais.totalDescontado,
    } as PedidoInterface; // A tipagem PedidoInterface deve ser consistente

    onSave(pedidoAtualizado, orcamentoItens).then(() => {
      addNotification({
        message: `Orçamento modificado para pedido #${orcamentoPedido.numeroPedido}`,
        type: StatusType.em_analise,
        link: `/pedido-orcamento/${orcamentoPedido.id}`,
        destinatarioId: orcamentoPedido.idCliente || "",
        destinatarioTipo: "cliente",
      })
      onOpenChange(false) // Fecha o modal após salvar
    })
  }

  if (!orcamentoPedido) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Orçamento do Pedido #{orcamentoPedido.numeroPedido}</DialogTitle>

          <DialogDescription asChild>
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
          </DialogDescription>
        </DialogHeader>

        {/* Produtos */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Produtos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 border">Produto</th>
                  <th className="p-2 border">Quantidade</th>
                  <th className="p-2 border">Preço</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orcamentoItens.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-transparent">
                    <td className="p-2 border">{item.produto?.nome}</td>

                    {/* Quantidade */}
                    <td className="p-2 border">
                      <input
                        autoComplete="off"
                        type="number"
                        min={0}
                        value={item.quantidade}
                        onChange={e => {
                          const quantidade = parseFloat(e.target.value) || 0
                          setOrcamentoItens(prev =>
                            prev.map((it, i) =>
                              i === idx
                                ? {
                                  ...it,
                                  quantidade,
                                  subtotal: quantidade * it.preco,
                                }
                                : it
                            ) as ItemOrcamento[]
                          )
                        }}
                        className="w-20 border rounded px-2 py-1 text-right"
                      />
                    </td>

                    {/* Preço */}
                    <td className="p-2 border">
                      <input
                        autoComplete="off"
                        type="text"
                        value={item.precoInput ?? formatCurrency(item.preco)}
                        onChange={e => {
                          const valorDigitado = e.target.value

                          setOrcamentoItens(prev =>
                            prev.map((it, i) =>
                              i === idx ? { ...it, precoInput: valorDigitado } : it
                            ) as ItemOrcamento[]
                          )
                        }}
                        onBlur={e => {
                          const valorDigitado = e.target.value
                          // Trata a conversão de PT-BR (vírgula) para JS (ponto)
                          const valorNumerico = parseFloat(valorDigitado.replace(",", ".")) || 0

                          setOrcamentoItens(prev =>
                            prev.map((it, i) =>
                              i === idx
                                ? {
                                  ...it,
                                  preco: valorNumerico,
                                  precoInput: formatCurrency(valorNumerico),
                                  subtotal: valorNumerico * it.quantidade,
                                }
                                : it
                            ) as ItemOrcamento[]
                          )
                        }}
                        className="w-24 border rounded px-2 py-1 text-right"
                      />
                    </td>

                    {/* Subtotal */}
                    <td className="p-2 border font-semibold text-right">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Descontos */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Desconto em valor */}
          <div className="space-y-2">
            <label className="block font-medium">Desconto em valor</label>
            <input
              autoComplete="off"
              type="text"
              value={descontoValorInput}
              onChange={handleValorChange}
              onBlur={handleValorBlur}
              className="w-full border rounded px-2 py-1 text-right"
              disabled={descontoPorcentagem > 0}
            />
          </div>

          {/* Desconto em % */}
          <div className="space-y-2">
            <label className="block font-medium">Desconto em %</label>
            <input
              autoComplete="off"
              type="text"
              value={descontoPorcentagemInput}
              onChange={handlePorcentagemChange}
              onBlur={handlePorcentagemBlur}
              className="w-full border rounded px-2 py-1 text-right"
              disabled={descontoValor > 0}
            />
          </div>
        </div>

        {/* Totais */}
        <div className="mt-6 flex flex-col gap-2">
          <div className="flex justify-between">
            <span>Total sem desconto:</span>
            <span className="font-semibold">
              {formatCurrencyBR(totais.total)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Valor do Desconto:</span>
            <span className="font-semibold text-red-500">
              - {formatCurrencyBR(totais.desconto)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Total com desconto:</span>
            <span className="font-bold text-primary">
              {formatCurrencyBR(totais.totalDescontado)}
            </span>
          </div>
        </div>

        {/* Botões */}
        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveOrcamento}
            className="bg-primary text-white"
          >
            Salvar Orçamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


/**
 * 5. Componente Principal
 */
export default function PedidosPage() {

  const { user, isVendedor } = useAuth()
  const { addNotification } = useNotification()
  const [pedidos, setPedidos] = useState<PedidoInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusType | "todos">("todos")

  // Estados para Detalhes (Modal 1)
  const [selectedPedido, setSelectedPedido] = useState<PedidoInterface | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Estados para Orçamento (Modal 2)
  const [orcamentoPedido, setOrcamentoPedido] = useState<PedidoInterface | null>(null)
  const [isOrcamentoOpen, setIsOrcamentoOpen] = useState(false)


  const loadPedidos = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true)
      const data = await pedidoService.getAll(user.idUsuario)

      const pedidosComImagem = await Promise.all(data.map(async (pedido) => {
        // Correção: a função acertaNomeImagem agora recebe itens, deve ser chamada para cada pedido.
        await acertaNomeImagem(pedido.itens)
        return pedido
      }))

      setPedidos(pedidosComImagem)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (isVendedor && user) {
      loadPedidos()
    }
  }, [isVendedor, user, loadPedidos])

  const qualStatus = (status: StatusType) => {
    if (status === StatusType.pendente) {
      return 'pendente'
    } else if (status === StatusType.aprovado) {
      return 'aprovado'
    } else if (status === StatusType.em_separacao) {
      return 'em_separacao'
    } else if (status === StatusType.enviado) {
      return 'enviado'
    } else if (status === StatusType.entregue) {
      return 'entregue'
    } else if (status === StatusType.em_analise) {
      return 'em_analise'
    } else {
      return 'cancelado'
    }
  }

  const handleViewDetails = async (pedido: PedidoInterface) => {
    try {
      // Carregar detalhes completos do pedido (mantido como estava para garantir os dados)
      const pedidoCompleto = await pedidoService.getByCliente(pedido.idCliente)
      const pedidoDetalhado = pedidoCompleto.find((p) => p.id === pedido.id)

      if (pedidoDetalhado) {
        // Ajusta a imagem dos itens antes de exibir
        await acertaNomeImagem(pedidoDetalhado.itens)

        setSelectedPedido(pedidoDetalhado)
        setIsDialogOpen(true) // Abre o modal de Detalhes
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido:", error)
    }
  }

  const handleUpdateStatus = async (novoStatus: StatusType) => {
    if (!selectedPedido) return

    try {
      setUpdatingStatus(true)
      // Cria uma cópia para modificação local antes de enviar
      const pedidoParaAtualizar = { ...selectedPedido, status: novoStatus };

      // O create está sendo usado para update. A API deve lidar com isso.
      await pedidoService.create(pedidoParaAtualizar, user?.token as string)

      // Atualizar lista de pedidos e o estado local
      await loadPedidos()
      setSelectedPedido(pedidoParaAtualizar) // Atualiza o estado do modal

      // Notificações
      if (novoStatus === StatusType.aprovado) {
        // ... (lógica de notificação mantida)
        addNotification({
          message: `Pedido #${selectedPedido.numeroPedido} enviado para aprovação do cliente!`,
          type: novoStatus,
          link: `/pedido-confirmado/${selectedPedido.id}`,
          destinatarioId: selectedPedido.idCliente,
          destinatarioTipo: "cliente"
        })
      } else if (novoStatus === StatusType.cancelado) {
        // ... (lógica de notificação mantida)
        addNotification({
          message: `Pedido #${selectedPedido.numeroPedido} foi cancelado pelo cliente!`,
          type: novoStatus,
          link: `/dashboard/pedidos?pedido=${selectedPedido.id}`,
          destinatarioId: selectedPedido.idVendedor,
          destinatarioTipo: "vendedor"
        })
      } else if ([StatusType.em_separacao, StatusType.enviado, StatusType.entregue].includes(novoStatus)) {
        // ... (lógica de notificação mantida)
        addNotification({
          message: `Status do pedido #${selectedPedido.numeroPedido} atualizado para: ${qualStatus(novoStatus)}!`,
          type: novoStatus,
          link: `/pedido-confirmado/${selectedPedido.id}`,
          destinatarioId: selectedPedido.idCliente,
          destinatarioTipo: "cliente"
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      addNotification({
        message: "Erro ao atualizar status do pedido.",
        type: selectedPedido.status,
        destinatarioId: user?.idUsuario || "",
        destinatarioTipo: "vendedor"
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const salvarPedido = async (pedidoAtualizado: PedidoInterface, itensAtualizado: ItemOrcamento[]) => {
    try {
      // 1. Define o status
      const novoStatus = pedidoAtualizado.status === StatusType.pendente || pedidoAtualizado.status === StatusType.em_analise
        ? StatusType.em_analise
        : StatusType.pendente;

      // 2. Atualiza o objeto pedido antes de enviar
      const pedidoFinal: PedidoInterface = {
        ...pedidoAtualizado,
        status: novoStatus,
        itens: itensAtualizado,
        // Os totais já devem estar corretos no pedidoAtualizado vindo do modal
      };

      // 3. Atualiza os itens
      // A API `pedidoService.details` deve aceitar DetalhePedidoInterface[]
      await pedidoService.details(itensAtualizado, user?.token as string)

      // 4. Atualiza o cabeçalho do pedido
      const rs = await pedidoService.create(pedidoFinal, user?.token as string)

      if (!rs) {
        addNotification({
          message: "Erro ao salvar pedido.",
          type: pedidoFinal.status,
          destinatarioId: user?.idUsuario || "",
          destinatarioTipo: "vendedor"
        })
      }

    } catch (error) {
      console.error("Erro ao salvar pedido:", error)

    } finally {
      loadPedidos()
    }
  }

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())


    const matchesStatus =
      statusFilter === "todos" || pedido.status === Number(statusFilter)

    return matchesSearch && matchesStatus
  })

  if (!isVendedor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Acesso negado. Apenas vendedores podem acessar esta página.</p>
      </div>
    )
  }


  const handleOpenOrcamento = (pedido: PedidoInterface) => {
    setOrcamentoPedido(pedido);
    setIsOrcamentoOpen(true);
  }

  return (
    <div className=" bg-background w-full">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:w-full sm:w-full w-85">
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

              <Select
                value={String(statusFilter)}
                onValueChange={(value) =>
                  setStatusFilter(value === "todos" ? "todos" : Number(value) as StatusType)
                }
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  {Object.entries(StatusType)
                    .filter(([key, val]) => !isNaN(Number(val)))
                    .map(([key, val]) => (
                      <SelectItem key={val} value={String(val)}>
                        {statusConfig[val as StatusType].label}
                      </SelectItem>
                    ))}
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
                          <TableCell className="font-medium">#{pedido.numeroPedido}</TableCell>
                          <TableCell>{pedido.cliente?.nome || "Cliente não encontrado"}</TableCell>
                          <TableCell>{new Date(pedido.data).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            {formatCurrencyBR(pedido.totalDescontado)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={statusConfig[pedido.status].variant}
                              className={statusConfig[pedido.status].color}
                            >
                              {React.createElement(statusConfig[pedido.status].icon, {
                                className: "mr-2 h-4 w-4",
                              })}
                              {statusConfig[pedido.status].label}
                            </Badge>

                          </TableCell>
                          <TableCell className="text-right flex gap-2 justify-end">
                            <Condicional condicao={pedido.status !== StatusType.pendente}>
                              <Button variant="ghost" size="icon" onClick={() => handleViewDetails(pedido)} title="Ver Detalhes">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Condicional>
                            {[StatusType.pendente, StatusType.em_analise].includes(pedido.status) && (
                              <Button
                                variant="outline"
                                size="icon"
                                title="Fazer Orçamento"
                                onClick={() => handleOpenOrcamento(pedido)}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
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

      {/* Modal de Detalhes (separado) */}
      <DetalhesPedidoDialog
        pedido={selectedPedido}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdateStatus={handleUpdateStatus}
        updatingStatus={updatingStatus}
        formatCurrencyBR={formatCurrencyBR}
      />

      {/* Modal de Orçamento (separado) */}
      <OrcamentoPedidoDialog
        orcamentoPedido={orcamentoPedido}
        isOpen={isOrcamentoOpen}
        onOpenChange={setIsOrcamentoOpen}
        onSave={salvarPedido}
        formatCurrency={formatCurrency}
        formatCurrencyBR={formatCurrencyBR}
      />

    </div>
  )
}