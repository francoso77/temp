"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Palette, Save } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { vendedorService } from "@/services/api"

export default function ConfiguracoesPage() {
  const { user, isVendedor } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cnpj: "",
    whatsapp: "",
  })

  useEffect(() => {
    if (isVendedor && user) {
      loadVendedorData()
    }

    // Carregar tema salvo
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [isVendedor, user])

  const loadVendedorData = async () => {
    try {
      setLoading(true)
      const vendedor = await vendedorService.getProfile()
      setFormData({
        nome: vendedor.nome,
        email: vendedor.email,
        cnpj: vendedor.cnpj || "",
        whatsapp: vendedor.whatsapp || "",
      })
    } catch (error) {
      console.error("Erro ao carregar dados do vendedor:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      await vendedorService.updateProfile(formData)
      alert("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      alert("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const applyTheme = (newTheme: "light" | "dark") => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  const handleThemeChange = (isDark: boolean) => {
    const newTheme = isDark ? "dark" : "light"
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18)
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15)
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="font-bold text-3xl">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências e informações pessoais</p>
            </div>

            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="perfil" className="gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="aparencia" className="gap-2">
                  <Palette className="h-4 w-4" />
                  Aparência
                </TabsTrigger>
              </TabsList>

              <TabsContent value="perfil" className="space-y-4">
                <Card className="dark:border-gray-300 dark:border">
                  <CardHeader>
                    <CardTitle>Informações do Vendedor</CardTitle>
                    <CardDescription>Atualize seus dados cadastrais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">Carregando dados...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="nome">Nome Completo *</Label>
                            <Input
                              id="nome"
                              value={formData.nome}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                              placeholder="Seu nome completo"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="seu@email.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                              id="cnpj"
                              value={formData.cnpj}
                              onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                              placeholder="00.000.000/0000-00"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input
                              id="whatsapp"
                              value={formData.whatsapp}
                              onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
                              placeholder="(00) 00000-0000"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button type="submit" disabled={saving} className="gap-2">
                            <Save className="h-4 w-4" />
                            {saving ? "Salvando..." : "Salvar Alterações"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="aparencia" className="space-y-4">
                <Card className="dark:border-gray-300 dark:border">
                  <CardHeader>
                    <CardTitle>Tema do Aplicativo</CardTitle>
                    <CardDescription>Escolha entre tema claro ou escuro</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">Modo Escuro</p>
                        <p className="text-sm text-muted-foreground">
                          Ative o modo escuro para reduzir o cansaço visual
                        </p>
                      </div>
                      <Switch checked={theme === "dark"} onCheckedChange={handleThemeChange} />
                    </div>

                    <div className="border rounded-lg p-4 bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        <strong>Dica:</strong> O tema escolhido será salvo e aplicado automaticamente nas próximas
                        visitas.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:border-gray-300 dark:border">
                  <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                    <CardDescription>Veja como o tema fica aplicado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg dark:border-gray-300">
                        <h3 className="font-semibold mb-2">Exemplo de Card</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Este é um exemplo de como os cards aparecem com o tema atual.
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm">Botão Primário</Button>
                          <Button size="sm" variant="outline">
                            Botão Secundário
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
