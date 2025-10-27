export interface NotificacaoInterface {
  id?: string
  message: string
  type: "info" | "success" | "error" | "warning"
  link?: string
  destinatarioId: string
  destinatarioTipo: "vendedor" | "cliente"
  pedidoClienteId?: string
  pedidoVendedorId?: string
  vendedorWhatsapp?: string
  readed: boolean
  createdAt: string
  updatedAt: string
}