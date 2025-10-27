"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { AuthContextType } from '@/app/types/AuthContextType'
import useMensagemState from './MensagemState'
import { LoginInterface } from '@/app/interfaces/sistema/user'
import ClsApi from '@/app/utils/ClsApi'
import { RespostaPadraoInterface } from '@/app/interfaces/respostaPadrao.interface'
import { useRouter } from 'next/navigation'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginInterface | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isVendedor, setIsVendedor] = useState(false)
  const [vendedorId, setVendedorId] = useState<string | null>(null)
  const { mensagemState, setMensagemState } = useMensagemState()
  const router = useRouter()
  const clsApi: ClsApi = new ClsApi();

  const login = async (email: string, senha?: string, tipo: "cliente" | "vendedor" = "cliente") => {
    try {
      await clsApi.execute<RespostaPadraoInterface<LoginInterface>>({
        url: 'loginUsuario',
        method: 'post',
        email,
        senha,
        tipo,
        mensagem: 'Validando usuário...',
        setMensagemState,
      }).then((response) => {
        //console.log('Resposta do login:', response);
        // Se o login for bem-sucedido, armazene os dados do usuário e o token
        if (response && response.ok && response.dados) {
          setUser(response.dados)
          setIsAuthenticated(true)
          if (tipo === "vendedor") {
            setIsVendedor(true)
            setVendedorId(response.dados.idUsuario)
          } else {
            setIsVendedor(false)
            setVendedorId(null)
          }
          localStorage.setItem("user", JSON.stringify(response.dados))
          localStorage.setItem("auth_token", response.dados.token)

        } else {
          setIsAuthenticated(false)
          setUser(null)
          setMensagemState({
            titulo: "Erro ...",
            exibir: true,
            mensagem: response?.mensagem || 'Não foi possível realizar o login. Tente novamente.',
            tipo: "error",
            exibirBotao: true,
            cb: null
          })
          throw new Error('Login falhou')
        }
      })

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
    setIsVendedor(false)
    setVendedorId(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isVendedor,
        vendedorId: vendedorId as string,
        mensagemState,
        setMensagemState,
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
