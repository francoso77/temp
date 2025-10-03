"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Mail, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [customerData, setCustomerData] = useState({ nome: "", email: "" })
  const [vendorData, setVendorData] = useState({ email: "", senha: "" })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("customer")
  const { login } = useAuth()
  const router = useRouter()

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerData.nome || !customerData.email) return

    setLoading(true)
    try {
      await login(customerData.email, undefined, "cliente")
      router.push("/")
    } catch (error) {
      console.error("Erro no login:", error)
      alert("Erro ao fazer login. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleVendorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendorData.email || !vendorData.senha) return

    setLoading(true)
    try {
      await login(vendorData.email, vendorData.senha, "vendedor")
      router.push("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
      alert("Credenciais inválidas. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao catálogo
        </Link>

        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Entrar</CardTitle>
            <CardDescription className="text-muted-foreground">
              Faça login para continuar suas compras ou acessar o dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Cliente</TabsTrigger>
                <TabsTrigger value="vendor">Vendedor</TabsTrigger>
              </TabsList>

              {/* Customer Login */}
              <TabsContent value="customer" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <User className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Login Rápido</h3>
                  <p className="text-sm text-muted-foreground">Apenas nome e e-mail para começar</p>
                </div>

                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Nome completo</Label>
                    <Input
                      id="customer-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={customerData.nome}
                      onChange={(e) => setCustomerData({ ...customerData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-email">E-mail</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar como Cliente"}
                  </Button>
                </form>
              </TabsContent>

              {/* Vendor Login */}
              <TabsContent value="vendor" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <Lock className="h-12 w-12 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Área do Vendedor</h3>
                  <p className="text-sm text-muted-foreground">Acesso ao dashboard administrativo</p>
                </div>

                <form onSubmit={handleVendorLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendor-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="vendor-email"
                        type="email"
                        placeholder="vendedor@email.com"
                        value={vendorData.email}
                        onChange={(e) => setVendorData({ ...vendorData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="vendor-password"
                        type="password"
                        placeholder="Sua senha"
                        value={vendorData.senha}
                        onChange={(e) => setVendorData({ ...vendorData, senha: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar como Vendedor"}
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Primeira vez aqui?{" "}
                    <Link href="/registro-vendedor" className="text-primary hover:underline font-medium">
                      Criar conta de vendedor
                    </Link>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-muted-foreground">Ao continuar, você concorda com nossos termos de uso</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
