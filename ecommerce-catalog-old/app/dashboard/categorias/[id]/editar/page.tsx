"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import type { Category, Product } from "@/lib/types"
import { categoryService, productService } from "@/services/api"

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
  })

  useEffect(() => {
    if (params.id) {
      loadCategory(params.id as string)
    }
  }, [params.id])

  const loadCategory = async (id: string) => {
    try {
      // Mock implementation - in real app would call productService.getById(id)
      const allCategorys = await categoryService.getAll()
      const foundCategory = allCategorys.find((c) => c.id === id)

      if (!foundCategory) {
        router.push("/dashboard/categorias")
        return
      }

      setCategory(foundCategory)
      setFormData({
        name: foundCategory.name,
      })
    } catch (error) {
      console.error("Erro ao carregar categoria:", error)
      router.push("/dashboard/categorias")
    } finally {
      setLoadingCategory(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !category) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    try {
      await categoryService.update(category.id, {
        name: formData.name,
      })

      router.push("/dashboard/categorias")
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
      alert("Erro ao atualizar categoria. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loadingCategory) {
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

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Categoria não encontrada</h1>
            <Link href="/dashboard/categorias">
              <Button>Voltar para categorias</Button>
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
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard/categorias">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para categorias
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Editar Categoria</h1>
            <p className="text-muted-foreground">Atualize as informações da categoria "{category.name}"</p>
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
                    <Label htmlFor="name">Nome da categoria *</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Eletrodomésticos"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard/categorias">Cancelar</Link>
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
