"use client"

import React, { useState } from "react"
import { useNotification } from "@/contexts/NotificationContext"
import { useAuth } from "@/contexts/AuthContext"
import { X } from "lucide-react"
import Link from "next/link"
import { pedidoService } from "@/services/api"


export function NotificationCenter() {
  const { notifications, markAsRead, addNotification } = useNotification()
  const { user, isVendedor } = useAuth()
  if (!user) return null
  const tipo = isVendedor ? "vendedor" : "cliente"
  const userNotifications = notifications.filter(n => n.destinatarioId === user.id && n.destinatarioTipo === tipo)
  if (userNotifications.length === 0) return null

  // Estado para mostrar ações do cliente para pedido em análise
  const [actionNotificationId, setActionNotificationId] = useState<string | null>(null)

  async function handleNotificationClick(n: any) {
    markAsRead(n.id)
    // Se vendedor, notificação de novo pedido pendente, muda status para em_analise e notifica cliente
    if (isVendedor && n.message?.toLowerCase().includes("novo pedido pendente")) {
      try {
        // Extrair id do pedido do link (espera-se /dashboard/pedidos?pedido=ID ou similar)
        const match = n.link?.match(/pedido[s]?[=/](\w+)/i)
        const pedidoId = match ? match[1] : null
        if (pedidoId) {
          await pedidoService.updateStatus(pedidoId, "em_analise")
          // Notificar cliente
          if (n.pedidoClienteId) {
            addNotification({
              message: `Seu pedido #${pedidoId} está em análise pelo vendedor.`,
              type: "info",
              destinatarioId: n.pedidoClienteId,
              destinatarioTipo: "cliente",
              link: `/meus-pedidos?pedido=${pedidoId}`
            })
          }
        }
      } catch (e) {
        // erro silencioso
      }
    }
    // Se cliente, notificação de pedido em análise: mostrar ações
    if (!isVendedor && n.message?.toLowerCase().includes("em análise")) {
      setActionNotificationId(n.id)
    }
  }

  // Ações do cliente para pedido em análise
  async function handleClientAction(action: "confirmar" | "cancelar" | "whatsapp", n: any) {
    setActionNotificationId(null)
    // Extrair id do pedido do link
    const match = n.link?.match(/pedido[s]?[=/](\w+)/i)
    const pedidoId = match ? match[1] : null
    if (!pedidoId) return
    if (action === "confirmar") {
      await pedidoService.updateStatus(pedidoId, "aprovado")
      // Notifica vendedor
      addNotification({
        message: `O cliente confirmou o pedido #${pedidoId}. Aguarde separação dos itens.`,
        type: "success",
        destinatarioId: n.pedidoVendedorId,
        destinatarioTipo: "vendedor",
        link: `/dashboard/pedidos?pedido=${pedidoId}`
      })
    } else if (action === "cancelar") {
      await pedidoService.updateStatus(pedidoId, "cancelado")
      // Notifica vendedor
      addNotification({
        message: `O cliente cancelou o pedido #${pedidoId}.`,
        type: "error",
        destinatarioId: n.pedidoVendedorId,
        destinatarioTipo: "vendedor",
        link: `/dashboard/pedidos?pedido=${pedidoId}`
      })
    } else if (action === "whatsapp") {
      // Abrir WhatsApp do vendedor
      if (n.vendedorWhatsapp) {
        window.open(`https://wa.me/${n.vendedorWhatsapp}`, "_blank")
      }
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[100] w-96 max-w-full">
      <div className="bg-white border border-border rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="font-semibold">Notificações</span>
        </div>
        <ul className="divide-y divide-border max-h-96 overflow-y-auto">
          {userNotifications.map((n) => (
            <li key={n.id} className={`flex flex-col gap-2 px-4 py-3 ${n.read ? 'bg-gray-100 text-gray-400' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="text-sm">
                    {n.link ? (
                      <Link href={n.link} className="text-primary hover:underline" onClick={() => handleNotificationClick(n)}>
                        {n.message}
                      </Link>
                    ) : (
                      <span onClick={() => handleNotificationClick(n)} style={{ cursor: 'pointer' }}>{n.message}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 capitalize">{n.type}</div>
                </div>
                <button onClick={() => markAsRead(n.id)} className="ml-2 p-1 text-muted-foreground hover:text-primary">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* Ações do cliente para pedido em análise */}
              {!isVendedor && n.message?.toLowerCase().includes("em análise") && actionNotificationId === n.id && (
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
                  {n.vendedorWhatsapp && (
                    <button
                      className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600"
                      onClick={() => handleClientAction("whatsapp", n)}
                    >
                      Chamar no WhatsApp
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
