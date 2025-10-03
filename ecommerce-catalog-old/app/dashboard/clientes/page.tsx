"use client"

import { useState, useEffect, use } from "react"
import { Search, Mail, Phone, Calendar, Filter, MoreHorizontal, Eye, Users, Plus, PersonStanding, PersonStandingIcon, UserPlus, Edit2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/Sidebar"
import type { Cliente } from "@/lib/types"
import Link from 'next/link'
import { format } from 'date-fns'
import { useAuth } from '@/contexts/AuthContext'

// Mock data para clientes
const mockClientes: (Cliente & {
  ultimoPedido?: string
  totalPedidos: number
})[] = [
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@email.com",
      whatsapp: "(37) 99932-8661",
      cnpj: "12.345.678/0001-90",
      idRep: "1",
      dataCadastro: "2024-01-15",
      ultimoPedido: "2024-03-10",
      totalPedidos: 5,
      ativo: true,
    },
    {
      id: "2",
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      whatsapp: "(11) 98888-5678",
      cnpj: "12.345.678/0001-90",
      idRep: "1",
      dataCadastro: "2024-02-20",
      ultimoPedido: "2024-03-15",
      totalPedidos: 3,
      ativo: true,
    },
    {
      id: "3",
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      whatsapp: "(11) 97777-9012",
      cnpj: "12.345.678/0001-90",
      idRep: "1",
      dataCadastro: "2024-01-05",
      ultimoPedido: "2024-02-28",
      totalPedidos: 8,
      ativo: true,
    },
    {
      id: "4",
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      whatsapp: "(11) 96666-1234",
      cnpj: "12.345.678/0001-90",
      idRep: "2",
      dataCadastro: "2024-03-01",
      ultimoPedido: "2024-03-05",
      totalPedidos: 1,
      ativo: true,
    },
    {
      id: "5",
      nome: "Carlos Ferreira",
      email: "carlos.ferreira@email.com",
      whatsapp: "(11) 96666-3456",
      cnpj: "12.345.678/0001-90",
      idRep: "1",
      dataCadastro: "2023-12-10",
      ultimoPedido: "2023-12-15",
      totalPedidos: 2,
      ativo: false,
    },
  ]

export default function ClientesPage() {

  const user = useAuth()
  const [clientes, setClientes] = useState(mockClientes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | null>(null)
  const [filteredClientes, setFilteredClientes] = useState(mockClientes)

  const handleStatusChange = (value: string) => {
    if (value === 'null') {
      setStatusFilter(null)
    } else if (value === 'true') {
      setStatusFilter(true)
    } else if (value === 'false') {
      setStatusFilter(false)
    }
  }

  useEffect(() => {
    const clientsForUser = clientes.filter(cliente => cliente.idRep === user.user?.id)
    setClientes(clientsForUser)
  }, [])

  useEffect(() => {
    let filtered = clientes

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cliente.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por status
    if (statusFilter !== null) {
      filtered = filtered.filter((cliente) => cliente.ativo === statusFilter)
    }

    setFilteredClientes(filtered)
  }, [clientes, searchTerm, statusFilter])

  const formatDate = (dateString: string): string => {
    const dateStringLocal = `${dateString}T00:00:00`;
    const dateObject = new Date(dateStringLocal);
    if (isNaN(dateObject.getTime())) {
      return "Data Inválida";
    }
    return format(dateObject, "dd/MM/yyyy");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  };

  const handleWhatsApp = (whatsapp?: string, nome?: string) => {
    if (!whatsapp) {
      alert("Cliente não possui whatsapp cadastrado")
      return
    }
    const message = `Olá ${nome}! Como posso ajudá-lo hoje?`
    const whatsappUrl = `https://wa.me/55${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="flex min-h-screen bg-background">
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
                <UserPlus className="h-4 w-4 mr-2" />
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
                  <Badge className="h-4 w-4 bg-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-foreground">
                      {clientes.filter((c) => c.ativo).length}
                    </p>
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
                    <p className="text-sm font-medium text-muted-foreground">Com Pedidos</p>
                    <p className="text-2xl font-bold text-foreground">
                      {clientes.filter((c) => c.totalPedidos > 0).length}
                    </p>
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
                      placeholder="Buscar por nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select
                  value={statusFilter === null ? 'null' : statusFilter.toString()}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Use strings para os valores! */}
                    <SelectItem value="null">Todos os Status</SelectItem>
                    <SelectItem value="true">Ativos</SelectItem>
                    <SelectItem value="false">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead>Último Pedido</TableHead>
                    <TableHead>Total Pedidos</TableHead>
                    <TableHead>Status</TableHead>
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
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {cliente.whatsapp && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {cliente.whatsapp}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-3 w-3 mr-1" />
                            <p className="text-sm text-muted-foreground">{cliente.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(cliente.dataCadastro)}</span>
                      </TableCell>
                      <TableCell>
                        {cliente.ultimoPedido ? (
                          <span className="text-sm text-muted-foreground">{formatDate(cliente.ultimoPedido)}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Nunca</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {cliente.totalPedidos} pedidos
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={cliente.ativo ? "default" : "secondary"}
                          className={cliente.ativo ? "bg-green-100 text-green-800" : ""}
                        >
                          {cliente.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {cliente.whatsapp && (
                              <DropdownMenuItem onClick={() => handleWhatsApp(cliente.whatsapp, cliente.nome)}>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredClientes.length === 0 && (
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
  )
}
