"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { TransactionModal } from "@/components/transaction-modal"
import { type Transaction, mockTransactions } from "@/lib/data"

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
  })

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions])
    setIsModalOpen(false)
  }

  const filteredTransactions = transactions.filter((transaction) => {
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
      <DashboardSidebar filters={filters} setFilters={setFilters} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onAddTransaction={() => setIsModalOpen(true)} />
        <DashboardContent transactions={filteredTransactions} onUpdateTransactions={setTransactions} />
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        editTransaction={null}
      />
    </div>
  )
}
