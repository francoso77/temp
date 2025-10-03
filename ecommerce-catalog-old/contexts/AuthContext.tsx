"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthContextType, Cliente, Representante, Usuario } from "@/lib/types"
import { clienteService, usuarioService } from "@/services/api"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isVendedor = user && "perfil" in user && user.perfil === "vendedor"

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem("user")
    const token = localStorage.getItem("auth_token")

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, senha?: string) => {
    try {
      if (senha) {
        // Login de vendedor
        const response = await usuarioService.login(email, senha)
        setUser(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))
        localStorage.setItem("auth_token", response.token)
      } else {
        // Login rápido de cliente (apenas nome e email)
        // const cliente = await clienteService.create({
        //   nome: email.split("@")[0], email,
        // })
        // setUser(cliente)
        // localStorage.setItem("user", JSON.stringify(cliente))
        const response = await usuarioService.login(email)
        setUser(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))
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
