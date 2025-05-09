"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Transaction, mockCategories, mockCompanies, type Account } from "@/lib/data"
import { TransactionsTable } from "@/components/transactions-table"
import { BarChart, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { CategoryPieChart } from "@/components/category-pie-chart"
import { FinancialChart } from "@/components/financial-chart"
import { useState } from "react"
import { TransactionModal } from "@/components/transaction-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface DashboardContentProps {
  transactions: Transaction[]
  onUpdateTransactions: (transactions: Transaction[]) => void
  selectedAccount: Account
}

export function DashboardContent({ transactions, onUpdateTransactions, selectedAccount }: DashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const { toast } = useToast()

  // Calculate financial metrics
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const currentBalance = selectedAccount.initialBalance + totalIncome - totalExpenses

  const handleAddTransaction = (transaction: Transaction) => {
    if (transactionToEdit) {
      // Editing existing transaction
      const updatedTransactions = transactions.map((t) => (t.id === transaction.id ? transaction : t))
      onUpdateTransactions(updatedTransactions)
      setTransactionToEdit(null)
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      })
    } else {
      // Adding new transaction
      onUpdateTransactions([transaction, ...transactions])
      toast({
        title: "Transação adicionada",
        description: "A nova transação foi adicionada com sucesso.",
      })
    }
    setIsModalOpen(false)
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction)
    setIsModalOpen(true)
  }

  const handleDeleteTransaction = (transaction: Transaction) => {
    setTransactionToDelete(transaction)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      onUpdateTransactions(transactions.filter((t) => t.id !== transactionToDelete.id))
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      })
      setTransactionToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: selectedAccount.currency }).format(
                currentBalance,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Atualizado em tempo real</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: selectedAccount.currency }).format(
                totalIncome,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total de receitas no período</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: selectedAccount.currency }).format(
                totalExpenses,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total de despesas no período</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">Total de transações no período</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Receitas e Despesas</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <FinancialChart transactions={transactions} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryPieChart transactions={transactions} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable
              transactions={transactions}
              categories={mockCategories}
              companies={mockCompanies}
              onEditTransaction={handleEditTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              pageSize={5}
            />
          </CardContent>
        </Card>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setTransactionToEdit(null)
        }}
        onAddTransaction={handleAddTransaction}
        editTransaction={transactionToEdit}
        selectedAccount={selectedAccount}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita e afetará o saldo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTransaction}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
