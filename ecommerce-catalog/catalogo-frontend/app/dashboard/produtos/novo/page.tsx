"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { produtoService, categoriaService } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import { CategoriaInterface } from '@/app/interfaces/categoria'

export default function NewProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState<CategoriaInterface[]>([])
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: 0,
    idCategoria: "",
    imagem: "",
    previewUrl: "",
    ativo: true,
    caracteristicas: "",
    desconto: 0,
    promocao: false,
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev: any) => ({
        ...prev,
        imagem: file,
        previewUrl: URL.createObjectURL(file),
      }))
    }
  }

  useEffect(() => {
    if (user) {
      loadCategorias()
    }
  }, [user])

  const loadCategorias = async () => {
    try {
      setLoadingCategorias(true)
      const data = await categoriaService.getAll(user!.idUsuario)
      setCategorias(data.filter((cat) => cat.ativo))
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    } finally {
      setLoadingCategorias(false)
    }
  }

  const parseBRLToNumber = (valor: string): number => {
    if (!valor) return 0

    // Remove "R$", espaços e pontos de milhar, e troca vírgula por ponto
    const cleanValue = valor
      .replace(/\s/g, "") // remove espaços
      .replace("R$", "")  // remove símbolo de moeda
      .replace(/\./g, "") // remove pontos
      .replace(",", ".")  // troca vírgula por ponto

    // Converte para número de ponto flutuante
    const numberValue = parseFloat(cleanValue)

    // Retorna 0 se não for número válido
    return isNaN(numberValue) ? 0 : numberValue
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.idCategoria) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    try {

      await produtoService.create({
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseBRLToNumber(formData.preco.toString()),
        idCategoria: formData.idCategoria,
        imagem: formData.imagem,
        ativo: formData.ativo,
        caracteristicas: formData.caracteristicas,
        idVendedor: user?.idUsuario,
        desconto: parseBRLToNumber(formData.desconto.toString()) || 0,
        promocao: formData.promocao,
      }, user!.token)

      router.push("/dashboard/produtos")
    } catch (error) {
      console.error("Erro ao criar produto:", error)
      alert("Erro ao criar produto. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
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
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Label htmlFor="caracteristicas">Características</Label>
                    <Textarea
                      id="caracteristicas"
                      placeholder="Ex: Garantia de 12 meses&#10;Entrega rápida em todo o Brasil&#10;Produto original e lacrado"
                      value={formData.caracteristicas}
                      onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">Digite cada característica em uma linha separada</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preco">Preço (R$) *</Label>
                      <Input
                        id="preco"
                        type="text"
                        inputMode="decimal"
                        placeholder="R$ 0,00"
                        value={formData.preco}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
                          let numberValue = Number(value) / 100; // divide por 100 para obter as casas decimais
                          const formatted = numberValue.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          });
                          handleInputChange("preco", formatted);
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desconto">Desconto (%)</Label>
                      <Input
                        id="desconto"
                        type="text"
                        inputMode="numeric"
                        pattern="^\d{1,2}$|^100$"
                        placeholder="0"
                        value={formData.desconto}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[^\d]/g, "");
                          if (Number(value) > 100) value = "100";
                          handleInputChange("desconto", value);
                        }}
                        maxLength={3}
                      />
                      <p className="text-xs text-muted-foreground">Percentual de desconto para este produto (0-100)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria *</Label>
                      <Select
                        value={formData.idCategoria}
                        onValueChange={(value) => handleInputChange("idCategoria", value)}
                        disabled={loadingCategorias}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingCategorias
                                ? "Carregando categorias..."
                                : categorias.length === 0
                                  ? "Nenhuma categoria cadastrada"
                                  : "Selecione uma categoria"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id}>
                              {categoria.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!loadingCategorias && categorias.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          Nenhuma categoria encontrada.{' '}
                          <Link href="/dashboard/categorias" className="text-primary hover:underline">
                            Cadastre uma categoria
                          </Link>{' '}
                          primeiro.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Switch
                      id="promocao"
                      checked={formData.promocao}
                      onCheckedChange={(checked) => handleInputChange("promocao", checked)}
                    />
                    <Label htmlFor="promocao">Destacar como promoção especial</Label>
                  </div>

                  <div className="flex items-center justify-between space-x-2 p-4 border border-border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="ativo">Status do Produto</Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.ativo ? "Produto ativo e visível no catálogo" : "Produto inativo e oculto"}
                      </p>
                    </div>
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => handleInputChange("ativo", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

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
                      value={
                        typeof formData.imagem === "string"
                          ? formData.imagem
                          : formData.previewUrl || ""
                      }
                      onChange={(e) => handleInputChange("imagem", e.target.value)}
                    />
                  </div>

                  {(formData.previewUrl || formData.imagem) && (
                    <div className="border border-border rounded-lg p-4">
                      <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
                      <Image
                        src={
                          typeof formData.imagem === "string"
                            ? formData.imagem
                            : formData.previewUrl
                        }
                        alt="Preview do produto"
                        width={200}
                        height={200}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}

                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Ou faça upload de uma imagem</p>
                    <Button type="button" variant="outline" size="sm" onClick={handleImageClick}>
                      Selecionar arquivo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG até 5MB</p>
                  </div>
                </CardContent>
              </Card>

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
