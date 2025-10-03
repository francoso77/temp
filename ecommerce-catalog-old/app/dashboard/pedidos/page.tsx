// "use client"

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
// import { pedidoService } from "@/services/api";
// import type { Pedido } from "@/lib/types";
// import { format } from 'date-fns';

// export default function DashboardPedidosPage() {
//   const [pedidos, setPedidos] = useState<Pedido[]>([]);
//   const [loading, setLoading] = useState(false);

//   async function loadPedidos() {
//     try {
//       setLoading(true);
//       // pedidoService.getAll() deve existir em services/api.ts (vi que há um mock)
//       const res = await pedidoService.getAll();
//       setPedidos(res || []);
//     } catch (err) {
//       console.error("Erro ao carregar pedidos", err);
//       setPedidos([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadPedidos();
//   }, []);

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-semibold">Pedidos</h2>
//         <div className="flex gap-2">
//           <Link href="/dashboard/pedidos/novo">
//             <Button>+ Novo Pedido</Button>
//           </Link>
//           <Button variant="outline" onClick={loadPedidos}>Atualizar</Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-4">
//         {loading ? (
//           <p>Carregando pedidos...</p>
//         ) : pedidos.length === 0 ? (
//           <p>Nenhum pedido encontrado.</p>
//         ) : (
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Pedido</TableCell>
//                 <TableCell>Cliente</TableCell>
//                 <TableCell>Data</TableCell>
//                 <TableCell>Total</TableCell>
//                 <TableCell>Itens</TableCell>
//                 <TableCell>Ações</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {pedidos.map((p) => (
//                 <TableRow key={p.id}>
//                   <TableCell>{p.id}</TableCell>
//                   <TableCell>{p.cliente?.nome || p.idCliente}</TableCell>
//                   <TableCell>{p.data ? format(new Date(p.data), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
//                   <TableCell>R$ {Number(p.total).toFixed(2)}</TableCell>
//                   <TableCell>{p.itens ? p.itens.length : 0}</TableCell>
//                   <TableCell>
//                     <div className="flex gap-2">
//                       <Link href={`/dashboard/pedidos/${p.id}`} className="underline">Ver</Link>
//                       {/* Aqui você pode adicionar ações: editar, cancelar, imprimir etc */}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MoreHorizontal, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Pedido } from "@/lib/types"
import { format } from "date-fns"

const pedidosMock: Pedido[] = [
  {
    id: "1",
    idCliente: "1",
    data: "2024-01-15T10:30:00Z",
    total: 2799.98,
    cliente: {
      id: "1", nome: "João Silva", email: "joao@email.com", idRep: "1", ativo: true,
      cnpj: '',
      whatsapp: '',
      dataCadastro: ''
    },
    idRep: "1",
    status: "aberto",
  },
  {
    id: "2",
    idCliente: "2",
    data: "2024-01-14T15:45:00Z",
    total: 1299.99,
    cliente: {
      id: "2", nome: "Maria Santos", email: "maria@email.com", idRep: "1", ativo: true,
      cnpj: '',
      whatsapp: '',
      dataCadastro: ''
    },
    idRep: "1",
    status: "aberto",
  },
  {
    id: "3",
    idCliente: "3",
    data: "2024-01-13T09:20:00Z",
    total: 899.99,
    cliente: {
      id: "3", nome: "Pedro Costa", email: "pedro@email.com", idRep: "1", ativo: true,
      cnpj: '',
      whatsapp: '',
      dataCadastro: ''
    },
    idRep: "1",
    status: "aberto",
  },
  {
    id: "4",
    idCliente: "4",
    data: "2024-01-12T14:10:00Z",
    total: 3499.99,
    cliente: {
      id: "4", nome: "Ana Oliveira", email: "ana@email.com", idRep: "1", ativo: true,
      cnpj: '',
      whatsapp: '',
      dataCadastro: ''
    },
    idRep: "1",
    status: "aberto",
  },
  {
    id: "5",
    idCliente: "5",
    data: "2024-01-11T11:55:00Z",
    total: 599.99,
    cliente: {
      id: "5", nome: "Carlos Lima", email: "carlos@email.com", idRep: "1", ativo: true,
      cnpj: '',
      whatsapp: '',
      dataCadastro: ''
    },
    idRep: "1",
    status: "aberto",
  },
]


export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPedidos = pedidos.filter(
    (p) =>
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleChangeStatus = (id: string, status: Pedido["status"]) => {
    setPedidos((prev) =>
      prev.map((pedido) => (pedido.id === id ? { ...pedido, status } : pedido)),
    )
  }

  function formatDate(dataString: string) {
    const data = new Date(dataString);

    const dia = data.getUTCDate().toString().padStart(2, '0');
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = data.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <Button>Novo Pedido</Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{pedidos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Abertos</p>
            <p className="text-2xl font-bold">{pedidos.filter((p) => p.status === "aberto").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Concluídos</p>
            <p className="text-2xl font-bold">{pedidos.filter((p) => p.status === "concluido").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cancelados</p>
            <p className="text-2xl font-bold">{pedidos.filter((p) => p.status === "cancelado").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtro */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nº ou cliente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos ({filteredPedidos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.id}</TableCell>
                  <TableCell>{pedido.cliente?.nome}</TableCell>
                  <TableCell>{formatDate(pedido.data)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        pedido.status === "aberto"
                          ? "bg-blue-100 text-blue-800"
                          : pedido.status === "concluido"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {pedido.status}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {pedido.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "aberto")}>
                          Marcar como Aberto
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "concluido")}>
                          Marcar como Concluído
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeStatus(pedido.id, "cancelado")}>
                          Marcar como Cancelado
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPedidos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Nenhum pedido encontrado</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
