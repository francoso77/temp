"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ConfiguracoesPage() {
  const filters = {
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar filters={filters} setFilters={() => {}} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onAddTransaction={() => {}} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Configurações</h1>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>Gerencie as configurações gerais do sistema financeiro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" defaultValue="Minha Empresa Ltda." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fiscal-year">Ano Fiscal</Label>
                    <Input id="fiscal-year" type="number" defaultValue={new Date().getFullYear()} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moeda Padrão</Label>
                    <Input id="currency" defaultValue="BRL" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Modo Escuro</Label>
                    <Switch id="dark-mode" />
                  </div>
                  <Button className="mt-4">Salvar Alterações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Notificações</CardTitle>
                  <CardDescription>Gerencie como e quando você recebe notificações.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-reminders">Lembretes de Pagamento</Label>
                    <Switch id="payment-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="balance-alerts">Alertas de Saldo</Label>
                    <Switch id="balance-alerts" />
                  </div>
                  <Button className="mt-4">Salvar Alterações</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Gerencie suas configurações de segurança e autenticação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
                    <Switch id="two-factor" />
                  </div>
                  <Button className="mt-4">Atualizar Senha</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>Conecte-se com outros serviços e sistemas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Integração Bancária</h3>
                      <p className="text-sm text-muted-foreground">Conecte suas contas bancárias</p>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Integração com ERP</h3>
                      <p className="text-sm text-muted-foreground">Sincronize com seu sistema ERP</p>
                    </div>
                    <Button variant="outline">Conectar</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">API de Pagamentos</h3>
                      <p className="text-sm text-muted-foreground">Integre com gateways de pagamento</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
