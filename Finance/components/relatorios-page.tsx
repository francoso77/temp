"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  mockTransactions,
  mockCategories,
  mockCompanies,
  type Account,
  getDefaultAccount,
  mockAccounts,
} from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { Button } from "@/components/ui/button"
import { Download, Printer, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { FinancialChart } from "@/components/financial-chart"
import { TransactionsTable } from "@/components/transactions-table"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function RelatoriosPage() {
  const [selectedAccount, setSelectedAccount] = useState<Account>(getDefaultAccount())
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
    accountId: selectedAccount.id,
  })
  const [activeTab, setActiveTab] = useState("overview")
  const printRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleAccountChange = (account: Account) => {
    setSelectedAccount(account)
    setFilters({ ...filters, accountId: account.id })
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    // Filter by account
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false
    }

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
  const currentBalance = selectedAccount.initialBalance + totalIncome - totalExpenses

  // Handle print functionality
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão permitidos.",
        variant: "destructive",
      })
      return
    }

    // Get the content to print
    const contentToPrint = printRef.current

    if (!contentToPrint) {
      printWindow.close()
      return
    }

    // Get the current date for the report header
    const currentDate = new Date().toLocaleDateString("pt-BR")

    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório Financeiro - ${currentDate}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            .account-info {
              margin-bottom: 20px;
              padding: 10px;
              background-color: #f8f9fa;
              border-radius: 5px;
            }
            .summary {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .summary-item {
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 15px;
              width: 30%;
            }
            .summary-item h3 {
              margin-top: 0;
              font-size: 16px;
              color: #666;
            }
            .summary-item p {
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0 5px;
            }
            .income { color: #22c55e; }
            .expense { color: #ef4444; }
            .balance { color: #3b82f6; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório Financeiro</h1>
            <p>Gerado em ${currentDate}</p>
          </div>
          
          <div class="account-info">
            <h2>Conta: ${selectedAccount.name}</h2>
            <p>Saldo Inicial: ${new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: selectedAccount.currency,
            }).format(selectedAccount.initialBalance)}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <h3>Saldo</h3>
              <p class="balance">${new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: selectedAccount.currency,
              }).format(currentBalance)}</p>
            </div>
            <div class="summary-item">
              <h3>Receitas</h3>
              <p class="income">${new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: selectedAccount.currency,
              }).format(totalIncome)}</p>
            </div>
            <div class="summary-item">
              <h3>Despesas</h3>
              <p class="expense">${new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: selectedAccount.currency,
              }).format(totalExpenses)}</p>
            </div>
          </div>
          
          <h2>Transações</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions
                .map((t) => {
                  const date = new Date(t.date).toLocaleDateString("pt-BR")
                  const category = mockCategories.find((c) => c.id === t.categoryId)?.name || "Sem categoria"
                  const type = t.type === "income" ? "Receita" : "Despesa"
                  const amount = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: selectedAccount.currency,
                  }).format(t.amount)
                  const amountClass = t.type === "income" ? "income" : "expense"

                  return `
                    <tr>
                      <td>${date}</td>
                      <td>${t.description}</td>
                      <td>${category}</td>
                      <td>${type}</td>
                      <td class="${amountClass}">${amount}</td>
                    </tr>
                  `
                })
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>FinanceControl - Sistema de Gestão Financeira</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for resources to load then print
    setTimeout(() => {
      printWindow.print()
      // Close the window after printing (optional)
      // printWindow.close()
    }, 500)

    toast({
      title: "Relatório preparado para impressão",
      description: "O relatório foi aberto em uma nova janela para impressão.",
    })
  }

  // Handle export to CSV
  const handleExportCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add headers
    csvContent += "Data,Descrição,Empresa,Categoria,Tipo,Valor\n"

    // Add data rows
    filteredTransactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR")
      const description = t.description.replace(/,/g, ";") // Replace commas to avoid CSV issues
      const company = mockCompanies.find((c) => c.id === t.companyId)?.name || "Sem empresa"
      const category = mockCategories.find((c) => c.id === t.categoryId)?.name || "Sem categoria"
      const type = t.type === "income" ? "Receita" : "Despesa"
      const amount = t.amount.toString().replace(".", ",") // Use comma as decimal separator for Excel

      csvContent += `${date},"${description}","${company}","${category}",${type},${amount}\n`
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `relatorio-financeiro-${selectedAccount.name}-${new Date().toISOString().split("T")[0]}.csv`,
    )
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação concluída",
      description: "O relatório foi exportado com sucesso no formato CSV.",
    })
  }

  // Handle export to Excel
  const handleExportExcel = () => {
    // This is a simplified Excel export that uses CSV with specific formatting
    // For a more robust Excel export, you would use a library like xlsx

    // Create CSV content with Excel formatting
    let csvContent = "data:application/vnd.ms-excel;charset=utf-8,"

    // Add headers with Excel formatting
    csvContent +=
      "<table><tr><th>Data</th><th>Descrição</th><th>Empresa</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Conta</th></tr>"

    // Add data rows
    filteredTransactions.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString("pt-BR")
      const description = t.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")
      const company = (mockCompanies.find((c) => c.id === t.companyId)?.name || "Sem empresa")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      const category = (mockCategories.find((c) => c.id === t.categoryId)?.name || "Sem categoria")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      const type = t.type === "income" ? "Receita" : "Despesa"
      const amount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: selectedAccount.currency,
      }).format(t.amount)
      const account = mockAccounts.find((acc) => acc.id === t.accountId)?.name || "Conta Desconhecida"

      csvContent += `<tr><td>${date}</td><td>${description}</td><td>${company}</td><td>${category}</td><td>${type}</td><td>${amount}</td><td>${account}</td></tr>`
    })

    csvContent += "</table>"

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `relatorio-financeiro-${selectedAccount.name}-${new Date().toISOString().split("T")[0]}.xls`,
    )
    document.body.appendChild(link)

    // Trigger download
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Exportação concluída",
      description: "O relatório foi exportado com sucesso no formato Excel.",
    })
  }

  // Handle export to PDF
  const handleExportPDF = () => {
    toast({
      title: "Exportação para PDF",
      description: "Para exportar como PDF, utilize a função de impressão e selecione 'Salvar como PDF'.",
    })

    // Trigger the print function which can be saved as PDF
    handlePrint()
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar
        filters={filters}
        setFilters={setFilters}
        selectedAccount={selectedAccount}
        onAccountChange={handleAccountChange}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader
          onAddTransaction={() => {}}
          selectedAccount={selectedAccount}
          onAccountChange={handleAccountChange}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Relatórios</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar como CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportExcel}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar como Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FilePdf className="mr-2 h-4 w-4" />
                    Exportar como PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div ref={printRef}>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Saldo no Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: selectedAccount.currency }).format(
                      currentBalance,
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Receitas no Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: selectedAccount.currency }).format(
                      totalIncome,
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Despesas no Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: selectedAccount.currency }).format(
                      totalExpenses,
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="income">Receitas</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="transactions">Transações</TabsTrigger>
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
                    <FinancialChart
                      transactions={filteredTransactions.filter((t) => t.type === "income")}
                      height={350}
                    />
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
              <TabsContent value="transactions">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Transações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TransactionsTable
                      transactions={filteredTransactions}
                      categories={mockCategories}
                      companies={mockCompanies}
                    />
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
