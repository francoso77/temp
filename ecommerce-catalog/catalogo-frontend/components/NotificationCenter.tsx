// NotificationCenter.tsx
"use client"

import React, { useEffect } from "react"
import { useNotification } from "@/contexts/NotificationContext"
import { useAuth } from "@/contexts/AuthContext"
import { X } from "lucide-react"
import Link from "next/link"
import { pedidoService } from "@/services/api"
import { StatusType } from "@/app/types/statusType"
import { Badge } from './ui/badge'

interface Props {
  onClose?: () => void
  panelRef?: React.RefObject<HTMLDivElement>
}

export function NotificationCenter({ onClose, panelRef }: Props) {
  const { markAsRead, addNotification, notifications, loadNotifications, removeNotification } = useNotification()
  const { user, isVendedor } = useAuth()

  const tipo = isVendedor ? "vendedor" : "cliente"

  useEffect(() => {
    if (user?.idUsuario) {
      loadNotifications(user.idUsuario, tipo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.idUsuario, tipo])

  const userNotifications = notifications.filter(
    n => n.destinatarioId === user?.idUsuario && n.destinatarioTipo === tipo
  )

  // If no notifications for this user, render nothing
  if (!userNotifications.length) return null

  async function handleNotificationClick(n: any) {
    // marcar como lida
    markAsRead(n.id)

    // fechar painel (se passado)
    if (onClose) onClose()

    if (isVendedor && n.message?.toLowerCase().includes("novo pedido pendente")) {
      try {
        const match = n.link?.match(/pedido[s]?[=/](\w+)/i)
        const pedidoId = match ? match[1] : null

        if (pedidoId) {
          const pedido = await pedidoService.getById(pedidoId)
          pedido.status = StatusType.em_analise
          await pedidoService.create(pedido, user?.token as string)

          if (n.pedidoClienteId) {
            addNotification({
              message: `Seu pedido #${pedidoId} está em análise pelo vendedor.`,
              type: pedido.status,
              destinatarioId: n.pedidoClienteId,
              destinatarioTipo: "cliente",
              link: `/meus-pedidos?pedido=${pedidoId}`,
            })
          }
        }
      } catch (e) {
        // erro silencioso
      }
    }

  }

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
  async function handleClientAction(action: "confirmar" | "cancelar" | "whatsapp", n: any) {
    const match = n.link?.match(/pedido[s]?[=/](\w+)/i)
    const pedidoId = match ? match[1] : null
    if (!pedidoId) return

    const pedido = await pedidoService.getById(pedidoId)

    if (action === "confirmar") {
      pedido.status = StatusType.aprovado
      await pedidoService.create(pedido, user?.token as string)

      addNotification({
        message: `O cliente confirmou o pedido #${pedidoId}. Aguarde separação dos itens.`,
        type: pedido.status,
        destinatarioId: n.pedidoVendedorId,
        destinatarioTipo: "vendedor",
        link: `/dashboard/pedidos?pedido=${pedidoId}`,
      })
    } else if (action === "cancelar") {
      pedido.status = StatusType.cancelado
      await pedidoService.create(pedido, user?.token as string)

      addNotification({
        message: `O cliente cancelou o pedido #${pedidoId}.`,
        type: pedido.status,
        destinatarioId: n.pedidoVendedorId,
        destinatarioTipo: "vendedor",
        link: `/dashboard/pedidos?pedido=${pedidoId}`,
      })
    }

    // Após ação do cliente, fechamos painel (se aplicável)
    if (onClose) onClose()
  }

  return (
    // Use ref vindo do Header para facilitar checagem de clique fora
    <div
      ref={panelRef}
      id="notification-center-container"
      className="bg-white border border-border rounded-lg shadow-lg overflow-hidden w-96 max-w-full"
      role="dialog"
      aria-label="Notificações"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="font-semibold">Notificações</span>
        <button onClick={() => onClose && onClose()} className="text-muted-foreground hover:text-foreground p-1">
          <X className="h-4 w-4" />
        </button>
      </div>

      <ul className="divide-y divide-border max-h-80 overflow-y-auto">
        {userNotifications.map(n => (
          <li
            key={n.id}
            className={`flex flex-col gap-2 px-4 py-3 ${n.read ? "bg-gray-100 text-gray-400" : ""}`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="text-sm">
                  {n.link ? (
                    <Link
                      href={n.link}
                      className="text-primary hover:underline"
                      onClick={() => handleNotificationClick(n)}
                    >
                      {n.message}
                    </Link>
                  ) : (
                    <span
                      onClick={() => handleNotificationClick(n)}
                      style={{ cursor: "pointer" }}
                    >
                      {n.message}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1 capitalize">
                  <Badge variant="secondary">{qualStatus(n.type)}</Badge>
                </div>
              </div>
              <button
                onClick={() => {
                  markAsRead(n.id)
                }}
                className="ml-2 p-1 text-muted-foreground hover:text-primary"
                aria-label="Marcar como lida"
              >
                <X
                  onClick={() => removeNotification(n.id)}
                  className="h-4 w-4" />
              </button>
            </div>

            {!isVendedor &&
              (n.type === StatusType.em_analise) &&
              (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700"
                    onClick={() => handleClientAction("confirmar", n)}
                  >
                    Confirmar Pedido
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                    onClick={() => handleClientAction("cancelar", n)}
                  >
                    Cancelar Pedido
                  </button>
                </div>
              )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NotificationCenter
