"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthContextType, Cliente, Vendedor } from "@/lib/types"
import { clienteService, vendedorService } from "@/services/api"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Cliente | Vendedor | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isVendedor = user && "cnpj" in user

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("auth_token")

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, senha?: string, tipo: "cliente" | "vendedor" = "cliente") => {
    try {
      if (tipo === "vendedor" && senha) {
        // Login de vendedor
        const response = await vendedorService.login(email, senha)
        setUser(response.vendedor)
        localStorage.setItem("user", JSON.stringify(response.vendedor))
        localStorage.setItem("auth_token", response.token)
      } else {
        // Login simples de cliente (nome e email)
        const response = await clienteService.login(email.split("@")[0], email)
        setUser(response.cliente)
        localStorage.setItem("user", JSON.stringify(response.cliente))
        localStorage.setItem("auth_token", response.token)
      }
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("auth_token")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isVendedor: !!isVendedor,
        vendedorId: isVendedor ? user.id : undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
