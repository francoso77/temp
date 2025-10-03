"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { clienteService } from "@/services/api"
import { useAuth } from '@/contexts/AuthContext'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, parse, parseISO, startOfDay } from "date-fns"
import { Cliente } from '@/lib/types'

export default function EditClientPage() {

  const params = useParams()
  const router = useRouter()
  const user = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingClient, setLoadingClient] = useState(true)
  const [client, setClient] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    cnpj: "",
    dataCadastro: "",
    ativo: true,
    idRep: user.user?.id || "",
  })

  const validateCNPJ = (cnpj: string): boolean => {
    const cleanedCNPJ = cnpj.replace(/[^\d]+/g, '');

    if (cleanedCNPJ.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleanedCNPJ)) return false;

    return /^\d{14}$/.test(cleanedCNPJ);
  }

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateWhatsapp = (whatsapp: string): boolean => {
    const cleanedWhatsapp = whatsapp.replace(/[^\d]+/g, '');
    return cleanedWhatsapp.length >= 10 && cleanedWhatsapp.length <= 11;
  };

  const validaDados = (): boolean => {
    return validateCNPJ(formData.cnpj) && validateEmail(formData.email) && validateWhatsapp(formData.whatsapp);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.nome ||
      !formData.dataCadastro ||
      !validaDados()
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    try {
      await clienteService.create({
        nome: formData.nome,
        email: formData.email,
        cnpj: formData.cnpj,
        whatsapp: formData.whatsapp,
        dataCadastro: formData.dataCadastro,
        idRep: user.user?.id || "",
        ativo: formData.ativo
      })

      router.push("/dashboard/clientes")
    } catch (error) {
      console.error("Erro ao criar cliente:", error)
      alert("Erro ao criar cliente. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const dateFromISOString = (isoString: string): Date => {
    const dateStringLocal = `${isoString}T00:00:00`;
    return new Date(dateStringLocal);
  };

  const dataDate = formData.dataCadastro
    ? dateFromISOString(formData.dataCadastro) // <--- USANDO A NOVA FUNÇÃO
    : undefined;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  useEffect(() => {
    if (params.id) {
      loadClient(params.id as string)
    }
  }, [params.id])

  const loadClient = async (id: string) => {
    try {
      // Mock implementation - in real app would call productService.getById(id)
      const allClients = await clienteService.getAll()
      const foundClient = allClients.find((p) => p.id === id)

      if (!foundClient) {
        router.push("/dashboard/clientes")
        return
      }

      setClient(foundClient)
      console.log(foundClient.dataCadastro)

      setFormData({
        nome: foundClient.nome,
        email: foundClient.email,
        whatsapp: foundClient.whatsapp,
        cnpj: foundClient.cnpj,
        dataCadastro: foundClient.dataCadastro,
        idRep: foundClient.idRep,
        ativo: foundClient.ativo
      })
    } catch (error) {
      console.error("Erro ao carregar cliente:", error)
      router.push("/dashboard/clientes")
    } finally {
      setLoadingClient(false)
    }
  }


  if (loadingClient) {
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

  if (!client) {
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
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard/clientes">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para clientes
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Editar Cliente</h1>
            <p className="text-muted-foreground">Atualize as informações do cliente "{client.nome}"</p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados Básicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="ativo">Cliente Ativo</Label>
                      <Switch
                        id="ativo"
                        checked={formData.ativo}
                        // 'checked' aqui é garantido como 'boolean' pelo 'onCheckedChange' do Switch
                        onCheckedChange={(checked: boolean) => handleInputChange("ativo", checked)}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {formData.ativo
                        ? "o cliente está visível e disponível para compra."
                        : "O cliente está inativo, oculto e não pode ser comprado."
                      }
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do cliente *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Smartphone Galaxy S24"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      placeholder="Ex: 00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange("cnpj", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      placeholder="Ex: cliente@email.com.br"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      placeholder="Ex: (00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      required
                    />
                  </div>

                  {/* Data de Cadastro (Com Seletor de Data) */}

                  <div className="space-y-2">
                    <Label htmlFor="dataCadastro">Data de Cadastro *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {/* 2. Exibe o objeto Date no formato Brasileiro (dd/MM/yyyy) */}
                          {dataDate && !isNaN(dataDate.getTime()) ? (
                            format(dataDate, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dataDate} // Usa o objeto Date convertido para marcar no calendário
                          onSelect={(date) => {
                            if (date) {
                              // 3. Ao selecionar, converte o objeto Date para a STRING no formato BR e salva no formData
                              const dataStringBR = format(date, "dd/MM/yyyy");
                              handleInputChange("dataCadastro", dataStringBR);
                            } else {
                              handleInputChange("dataCadastro", "");
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
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
