"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { categoryService, productService } from "@/services/api"
import { useAuth } from '@/contexts/AuthContext'
import { Category } from '@/lib/types'
import { Switch } from '@/components/ui/switch'

export default function NewProductPage() {
  const router = useRouter()
  const user = useAuth()
  const [categorys, setCategorys] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    caracteristicas: "",
    preco: "",
    idCategoria: "",
    imagem: "",
    desconto: 0,
    promocao: false,
    idRep: user.user?.id || "",
    ativo: true
  })

  const fetchCategorys = async () => {
    try {
      const response = await categoryService.getAll()
      setCategorys(response)
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
    }
  }
  useEffect(() => {
    fetchCategorys()
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.nome ||
      !formData.descricao ||
      !formData.preco ||
      !formData.idCategoria ||
      !formData.imagem ||
      !formData.promocao ||
      !formData.desconto
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    try {
      await productService.create({
        nome: formData.nome,
        descricao: formData.descricao,
        caracteristicas: formData.caracteristicas,
        preco: formData.preco,
        idCategoria: formData.idCategoria,
        imagem: formData.imagem || "/placeholder.svg",
        desconto: 0,
        promocao: false,
        idRep: user.user?.id || "",
        ativo: true
      })

      router.push("/dashboard/produtos")
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      alert("Erro ao criar produto. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatarMoeda = (value: string) => {
    // remove tudo que não é número
    const numero = value.replace(/\D/g, "")

    // transforma em centavos
    const valorNumerico = Number(numero) / 100

    // formata em BRL
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorNumerico)
  }

  const handleInputChange = (field: string, value: any) => {
    if (field === "preco") {
      setFormData((prev) => ({ ...prev, [field]: formatarMoeda(value) }))
    } else if (field === "imagem") {
      setUploading(true)
      setFormData((prev) => ({ ...prev, [field]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard/produtos">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para produtos
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Novo Produto</h1>
            <p className="text-muted-foreground">Adicione um novo produto ao seu catálogo</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="ativo">Produto Ativo</Label>
                      <Switch
                        id="ativo"
                        checked={formData.ativo}
                        // 'checked' aqui é garantido como 'boolean' pelo 'onCheckedChange' do Switch
                        onCheckedChange={(checked: boolean) => handleInputChange("ativo", checked)}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {formData.ativo
                        ? "O produto está visível e disponível para compra."
                        : "O produto está inativo, oculto e não pode ser comprado."
                      }
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do produto *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Smartphone Galaxy S24"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição *</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva as principais características do produto..."
                      value={formData.descricao}
                      onChange={(e) => handleInputChange("descricao", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Características </Label>
                    <Textarea
                      id="caracteristicas"
                      placeholder="Liste todas as características relacionada a esse produto..."
                      value={formData.caracteristicas}
                      onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preco">Preço (R$) *</Label>
                      <Input
                        id="preco"
                        type="text"
                        placeholder="R$ 0,00"
                        value={formData.preco}
                        onChange={(e) => handleInputChange("preco", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Select
                        value={formData.idCategoria}
                        onValueChange={(value) => handleInputChange("categoria", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorys.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>Imagem do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagem">URL da imagem</Label>
                    <Input
                      id="imagem"
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={formData.imagem}
                      onChange={(e) => handleInputChange("imagem", e.target.value)}
                    />
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Ou faça upload de uma imagem</p>
                    <Button type="button" variant="outline" size="sm">
                      Selecionar arquivo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG até 5MB</p>
                  </div>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader>
                  <CardTitle>Imagem do Produto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagem">URL da imagem</Label>
                    <Input
                      id="imagem"
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={formData.imagem}
                      onChange={(e) => handleInputChange("imagem", e.target.value)}
                    />
                  </div>

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Ou faça upload de uma imagem
                    </p>

                    {/* input escondido */}
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/png, image/jpeg"
                      className="hidden"
                      onChange={(e) => handleInputChange("imagem", e.target.value)}
                    />

                    {/* botão que dispara o input */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      {uploading ? "Enviando..." : "Selecionar arquivo"}
                    </Button>

                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Produto"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/produtos">Cancelar</Link>
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
