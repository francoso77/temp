import { StatusType } from './types/status'

export interface NotificacaoInterface {
  id?: string
  message: string
  type: StatusType
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