"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import type { Cliente } from "@/lib/types"
import { useAuth } from "@/contexts/AuthContext"
import { clienteService } from "@/services/api"

export default function ClientesPage() {
  const { user, isVendedor } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteCliente, setDeleteCliente] = useState<Cliente | null>(null)

  useEffect(() => {
    if (isVendedor && user) {
      loadClientes()
    }
  }, [isVendedor, user])

  const loadClientes = async () => {
    try {
      setLoading(true)
      const data = await clienteService.getAll(user!.id)
      setClientes(data)
      setFilteredClientes(data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = clientes

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cliente.cnpj && cliente.cnpj.includes(searchTerm)),
      )
    }

    setFilteredClientes(filtered)
  }, [clientes, searchTerm])

  const handleDeleteCliente = async (cliente: Cliente) => {
    try {
      await clienteService.delete(cliente.id)
      setClientes(clientes.filter((c) => c.id !== cliente.id))
      setDeleteCliente(null)
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      alert("Erro ao excluir cliente. Tente novamente.")
    }
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleWhatsApp = (telefone?: string, nome?: string) => {
    if (!telefone) {
      alert("Cliente não possui telefone cadastrado")
      return
    }
    const message = `Olá ${nome}! Como posso ajudá-lo hoje?`
    const whatsappUrl = `https://wa.me/55${telefone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleEmail = (email: string, nome: string) => {
    const subject = "Contato do Catálogo"
    const body = `Olá ${nome}!\n\nEspero que esteja bem. Como posso ajudá-lo hoje?\n\nAtenciosamente,\nEquipe Catálogo`
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)
  }

  if (!isVendedor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Acesso negado. Apenas vendedores podem acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
                <p className="text-muted-foreground">Gerencie seus clientes e relacionamentos</p>
              </div>
              <Link href="/dashboard/clientes/novo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                      <p className="text-2xl font-bold text-foreground">{clientes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                      <p className="text-2xl font-bold text-foreground">{clientes.filter((c) => c.ativo).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Novos este Mês</p>
                      <p className="text-2xl font-bold text-foreground">
                        {clientes.filter((c) => new Date(c.dataCadastro).getMonth() === new Date().getMonth()).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Com Telefone</p>
                      <p className="text-2xl font-bold text-foreground">{clientes.filter((c) => c.telefone).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar por nome, e-mail ou CNPJ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Carregando clientes...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClientes.map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {getInitials(cliente.nome)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{cliente.nome}</p>
                                <p className="text-sm text-muted-foreground">{cliente.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {cliente.cnpj ? (
                              <span className="text-sm text-muted-foreground">{cliente.cnpj}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground/50">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {cliente.telefone && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {cliente.telefone}
                                </div>
                              )}
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                E-mail
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {cliente.ativo ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inativo
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{formatDate(cliente.dataCadastro)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEmail(cliente.email, cliente.nome)}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Enviar E-mail
                                </DropdownMenuItem>
                                {cliente.telefone && (
                                  <DropdownMenuItem onClick={() => handleWhatsApp(cliente.telefone, cliente.nome)}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    WhatsApp
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/clientes/${cliente.id}/editar`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeleteCliente(cliente)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {!loading && filteredClientes.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <AlertDialog open={!!deleteCliente} onOpenChange={() => setDeleteCliente(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente "{deleteCliente?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCliente && handleDeleteCliente(deleteCliente)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
