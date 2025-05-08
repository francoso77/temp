"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { mockTransactions } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { FinancialChart } from "@/components/financial-chart"

export function RelatoriosPage() {
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
  })

  const filteredTransactions = mockTransactions.filter((transaction) => {
    // Filter by type
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false
    }

    // Filter by category
    if (filters.category !== "all" && transaction.categoryId !== filters.category) {
      return false
    }

    // Filter by date range
    if (filters.dateRange.from && filters.dateRange.to) {
      const transactionDate = new Date(transaction.date)
      const fromDate = new Date(filters.dateRange.from)
      const toDate = new Date(filters.dateRange.to)

      if (transactionDate < fromDate || transactionDate > toDate) {
        return false
      }
    }

    return true
  })

  // Calculate financial metrics
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const currentBalance = totalIncome - totalExpenses

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar filters={filters} setFilters={setFilters} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onAddTransaction={() => {}} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Relatórios</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Saldo no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(currentBalance)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Receitas no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalIncome)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Despesas no Período</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalExpenses)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Receitas e Despesas</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <FinancialChart transactions={filteredTransactions} height={350} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="income">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Receitas</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <FinancialChart transactions={filteredTransactions.filter((t) => t.type === "income")} height={350} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expenses">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Despesas</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <FinancialChart
                    transactions={filteredTransactions.filter((t) => t.type === "expense")}
                    height={350}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Categoria</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <CategoryPieChart transactions={filteredTransactions} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
