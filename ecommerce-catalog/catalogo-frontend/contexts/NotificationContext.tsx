"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { api } from "@/services/api"
import { StatusType } from '@/app/types/statusType'

export interface Notification {
  id: string
  message: string
  type: StatusType
  link?: string
  read?: boolean
  destinatarioId: string // id do usuário destinatário (cliente ou vendedor)
  destinatarioTipo: "cliente" | "vendedor"
  // Campos adicionais (workflow)
  pedidoVendedorId?: string
  pedidoClienteId?: string
  vendedorWhatsapp?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read">) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  loadNotifications: (userId: string, tipo: "cliente" | "vendedor") => Promise<void>
  clearNotifications: () => void
  removeNotification: (id: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  /**
   * Carrega as notificações do backend e atualiza o estado
   */
  async function loadNotifications(userId: string, tipo: "cliente" | "vendedor") {
    try {
      const response = await api.get(`/notificacoes/${tipo}/${userId}`)
      setNotifications(response.data || [])
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
      setNotifications([]) // Garante que o array está vazio em caso de erro
    }
  }

  /**
   * Adiciona uma nova notificação
   * - Salva no backend (POST /notificacoes)
   * - Atualiza o estado local
   */
  async function addNotification(notification: Omit<Notification, "id" | "read">) {
    try {
      const response = await api.post("/notificacoes", notification)
      const saved = response.data

      setNotifications((prev) => [saved, ...prev])
    } catch (error) {
      console.error("Erro ao salvar notificação:", error)

      // fallback local, caso backend falhe
      setNotifications((prev) => [
        {
          ...notification,
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          read: false,
        },
        ...prev,
      ])
    }
  }

  /**
   * Marca uma notificação como lida
   * - Atualiza no backend (PUT /notificacoes/:id/read)
   * - Atualiza o estado local
   */
  async function markAsRead(id: string) {
    try {
      await api.put(`/notificacoes/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error)
    }
  }

  /**
 * Remover uma notificação 
 * - Atualiza no backend (DELETE /notificacoes/:id read)
 * - Atualiza o estado local
 */
  async function removeNotification(id: string) {
    try {
      await api.delete(`/notificacoes/${id}`)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Erro ao remover notificação:", error)
    }
  }

  function clearNotifications() {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearNotifications, loadNotifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be used within a NotificationProvider")
  return ctx
}

export default NotificationProvider