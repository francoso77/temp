"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import type { Cliente } from "@/lib/types"
import { clienteService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

export default function EditClientePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingCliente, setLoadingCliente] = useState(true)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cnpj: "",
    ativo: true,
  })

  useEffect(() => {
    if (params.id && user) {
      loadCliente(params.id as string)
    }
  }, [params.id, user])

  const loadCliente = async (id: string) => {
    try {
      const allClientes = await clienteService.getAll(user!.id)
      const foundCliente = allClientes.find((c) => c.id === id)

      if (!foundCliente) {
        router.push("/dashboard/clientes")
        return
      }

      setCliente(foundCliente)
      setFormData({
        nome: foundCliente.nome,
        email: foundCliente.email,
        telefone: foundCliente.telefone || "",
        cnpj: foundCliente.cnpj || "",
        ativo: foundCliente.ativo,
      })
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      router.push("/dashboard/clientes")
    } finally {
      setLoadingCliente(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.email || !cliente) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    try {
      await clienteService.update(cliente.id, {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || undefined,
        cnpj: formData.cnpj || undefined,
        ativo: formData.ativo,
      })

      router.push("/dashboard/clientes")
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      alert("Erro ao atualizar cliente. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return value
  }

  if (loadingCliente) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-muted h-8 w-64 rounded"></div>
              <div className="bg-muted h-96 rounded-lg"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Cliente não encontrado</h1>
            <Link href="/dashboard/clientes">
              <Button>Voltar para clientes</Button>
            </Link>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-8">
            <Link href="/dashboard/clientes">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para clientes
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Editar Cliente</h1>
            <p className="text-muted-foreground">Atualize as informações do cliente "{cliente.nome}"</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: João da Silva"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@exemplo.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange("cnpj", formatCNPJ(e.target.value))}
                      maxLength={18}
                    />
                    <p className="text-xs text-muted-foreground">Formato: XX.XXX.XXX/XXXX-XX</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(11) 98765-4321"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", formatPhone(e.target.value))}
                      maxLength={15}
                    />
                    <p className="text-xs text-muted-foreground">Formato: (XX) XXXXX-XXXX</p>
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="ativo">Status</Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.ativo ? "Cliente ativo no sistema" : "Cliente inativo"}
                      </p>
                    </div>
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => handleInputChange("ativo", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data de Cadastro</Label>
                    <Input
                      value={new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Data em que o cliente foi cadastrado no sistema</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/clientes">Cancelar</Link>
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
