"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { categoriaService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { CategoriaInterface } from '@/app/interfaces/categoria'

export default function CategoriasPage() {
  const { user, isVendedor, setMensagemState } = useAuth()
  const [categorias, setCategorias] = useState<CategoriaInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<CategoriaInterface | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
    idVendedor: user?.idUsuario || "",
    dataCadastro: new Date().toISOString(),
  })

  useEffect(() => {
    if (isVendedor && user) {
      loadCategorias()
    }
  }, [isVendedor, user])

  const loadCategorias = async () => {
    try {
      setLoading(true)
      const data = await categoriaService.getAll(user!.idUsuario)
      setCategorias(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (categoria?: CategoriaInterface) => {
    if (categoria) {
      setEditingCategoria(categoria)
      setFormData({
        nome: categoria.nome,
        descricao: categoria.descricao || "",
        ativo: categoria.ativo,
        idVendedor: categoria.idVendedor,
        dataCadastro: categoria.dataCadastro,
      })
    } else {
      setEditingCategoria(null)
      setFormData({
        nome: "",
        descricao: "",
        ativo: true,
        idVendedor: user?.idUsuario || "",
        dataCadastro: new Date().toISOString(),
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCategoria(null)
    setFormData({
      nome: "",
      descricao: "",
      ativo: true,
      idVendedor: user?.idUsuario || "",
      dataCadastro: new Date().toISOString(),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategoria) {
        await categoriaService.create({
          ...formData,
          id: editingCategoria.id,
          idVendedor: user!.idUsuario,
        }, user!.idUsuario)
      } else {
        await categoriaService.create({
          ...formData,
          idVendedor: user!.idUsuario,
          ativo: true,
        }, user!.idUsuario)
      }

      await loadCategorias()
      handleCloseDialog()
    } catch (error) {
      console.error("Erro ao salvar categoria:", error)
    }
  }

  const handleDelete = async (id: string) => {

    setMensagemState({
      titulo: 'Cadastro',
      exibir: true,
      mensagem: "Tem certeza que deseja excluir esta categoria?",
      tipo: 'error',
      exibirBotao: "SN",
      cb: async (resposta: boolean) => {
        if (resposta) {
          try {
            await categoriaService.delete(id, user!.token)
            await loadCategorias()
          } catch (error) {
            console.error("Erro ao excluir categoria:", error)
            setMensagemState({
              titulo: 'Erro',
              exibir: true,
              mensagem: "Erro ao excluir categoria.",
              tipo: 'warning',
              exibirBotao: true,
              cb: () => { }
            })
          }
        }
      }
    })
  }

  const filteredCategorias = categorias.filter((cat) => cat.nome.toLowerCase().includes(searchTerm.toLowerCase()))

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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="font-bold text-3xl">Categorias</h1>
                <p className="text-muted-foreground">Gerencie as categorias dos seus produtos</p>
              </div>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando categorias...</p>
              </div>
            ) : (
              <div className="border rounded-lg ">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategorias.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhuma categoria encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCategorias.map((categoria) => (
                        <TableRow key={categoria.id}>
                          <TableCell className="font-medium">{categoria.nome}</TableCell>
                          <TableCell className="text-muted-foreground">{categoria.descricao || "-"}</TableCell>
                          <TableCell>
                            <Badge variant={categoria.ativo ? "default" : "secondary"}>
                              {categoria.ativo ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(categoria)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(categoria.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategoria ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {editingCategoria
                ? "Atualize as informações da categoria"
                : "Preencha os dados para criar uma nova categoria"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Cimento e Argamassa"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva a categoria..."
                  rows={3}
                />
              </div>

              {editingCategoria && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="ativo" className="cursor-pointer">
                    Categoria ativa
                  </Label>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">{editingCategoria ? "Salvar Alterações" : "Criar Categoria"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
