"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SortableTable } from "@/components/sortable-table"
import type { Category, Company, Transaction } from "@/lib/data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Edit, Trash2 } from "lucide-react"

interface TransactionsTableProps {
  transactions: Transaction[]
  categories: Category[]
  companies: Company[]
  onEditTransaction?: (transaction: Transaction) => void
  onDeleteTransaction?: (transaction: Transaction) => void
}

export function TransactionsTable({
  transactions,
  categories,
  companies,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsTableProps) {
  // Get the 10 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Sem categoria"
  }

  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId)
    return company ? company.name : "Sem empresa"
  }

  const columns = [
    {
      id: "date",
      header: "Data",
      cell: (transaction: Transaction) => format(new Date(transaction.date), "dd/MM/yyyy", { locale: ptBR }),
      sortable: true,
      sortingFn: (a: Transaction, b: Transaction) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      id: "description",
      header: "Descrição",
      cell: (transaction: Transaction) => <span className="font-medium">{transaction.description}</span>,
      sortable: true,
    },
    {
      id: "company",
      header: "Empresa",
      cell: (transaction: Transaction) => getCompanyName(transaction.companyId),
      sortable: true,
    },
    {
      id: "category",
      header: "Categoria",
      cell: (transaction: Transaction) => getCategoryName(transaction.categoryId),
      sortable: true,
    },
    {
      id: "type",
      header: "Tipo",
      cell: (transaction: Transaction) => (
        <Badge variant={transaction.type === "income" ? "success" : "destructive"}>
          {transaction.type === "income" ? "Receita" : "Despesa"}
        </Badge>
      ),
      sortable: true,
      sortingFn: (a: Transaction, b: Transaction) => a.type.localeCompare(b.type),
    },
    {
      id: "amount",
      header: "Valor",
      cell: (transaction: Transaction) => (
        <span className={`text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(transaction.amount)}
        </span>
      ),
      sortable: true,
      sortingFn: (a: Transaction, b: Transaction) => a.amount - b.amount,
    },
    {
      id: "actions",
      header: "Ações",
      cell: (transaction: Transaction) => (
        <div className="flex justify-end gap-2">
          {onEditTransaction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onEditTransaction(transaction)
              }}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          )}
          {onDeleteTransaction && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteTransaction(transaction)
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir</span>
            </Button>
          )}
        </div>
      ),
      sortable: false,
    },
  ]

  return (
    <SortableTable data={recentTransactions} columns={columns} defaultSortColumn="date" defaultSortDirection="desc" />
  )
}
