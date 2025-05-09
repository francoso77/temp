"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TransactionModal } from "@/components/transaction-modal"
import {
  type Transaction,
  mockTransactions,
  mockCategories,
  mockCompanies,
  type Account,
  getDefaultAccount,
} from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionsTable } from "@/components/transactions-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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

export function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<Account>(getDefaultAccount())
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
    accountId: selectedAccount.id,
  })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null)
  const { toast } = useToast()

  const handleAddTransaction = (transaction: Transaction) => {
    if (transactionToEdit) {
      // Editing existing transaction
      setTransactions(transactions.map((t) => (t.id === transaction.id ? transaction : t)))
      setTransactionToEdit(null)
      toast({
        title: "Transação atualizada",
        description: "A transação foi atualizada com sucesso.",
      })
    } else {
      // Adding new transaction
      setTransactions([transaction, ...transactions])
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
      setTransactions(transactions.filter((t) => t.id !== transactionToDelete.id))
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      })
      setTransactionToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const handleAccountChange = (account: Account) => {
    setSelectedAccount(account)
    setFilters({ ...filters, accountId: account.id })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by account
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false
    }

    // Search filter
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
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
          onAddTransaction={() => {
            setTransactionToEdit(null)
            setIsModalOpen(true)
          }}
          selectedAccount={selectedAccount}
          onAccountChange={handleAccountChange}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar transações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Todas as Transações</CardTitle>
                <Button
                  onClick={() => {
                    setTransactionToEdit(null)
                    setIsModalOpen(true)
                  }}
                >
                  Nova Transação
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                transactions={filteredTransactions}
                categories={mockCategories}
                companies={mockCompanies}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                pageSize={10}
              />
            </CardContent>
          </Card>
        </main>
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
    </div>
  )
}
