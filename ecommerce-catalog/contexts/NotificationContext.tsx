"use client"
import React, { createContext, useContext, useState, ReactNode } from "react"

export type NotificationType = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  message: string
  type: NotificationType
  link?: string
  read?: boolean
  destinatarioId: string // id do usuário destinatário (cliente ou vendedor)
  destinatarioTipo: "cliente" | "vendedor"
  // Para ações de workflow
  pedidoVendedorId?: string
  pedidoClienteId?: string
  vendedorWhatsapp?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read">) => void
  markAsRead: (id: string) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  function addNotification(notification: Omit<Notification, "id" | "read">) {
    setNotifications((prev) => [
      {
        ...notification,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        read: false,
      },
      ...prev,
    ])
  }

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // clearNotifications não faz mais nada, mantido para compatibilidade
  function clearNotifications() { }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be used within a NotificationProvider")
  return ctx
}
