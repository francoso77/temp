"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, UserCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserInfo {
  name: string
  email: string
}

export function UserDropdown() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    // Carregar informações do usuário do localStorage
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser)
        setUserInfo({
          name: userData.name || "Usuário",
          email: userData.email || "usuario@exemplo.com",
        })
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    // Remover usuário atual do localStorage
    localStorage.removeItem("currentUser")

    console.log("Usuário deslogado")
    router.push("/login") // Redireciona para a página de login
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">Perfil</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{userInfo?.name || "Usuário"}</span>
            <span className="text-xs text-muted-foreground">{userInfo?.email || "usuario@exemplo.com"}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil" className="flex w-full cursor-pointer items-center">
            <UserCircle className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/configuracoes" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
