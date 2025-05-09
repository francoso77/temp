"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { TransactionModal } from "@/components/transaction-modal"
import { type Transaction, mockTransactions, type Account, getDefaultAccount } from "@/lib/data"

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [selectedAccount, setSelectedAccount] = useState<Account>(getDefaultAccount())
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
    accountId: selectedAccount.id,
  })

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions])
    setIsModalOpen(false)
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
          onAddTransaction={() => setIsModalOpen(true)}
          selectedAccount={selectedAccount}
          onAccountChange={handleAccountChange}
        />
        <DashboardContent
          transactions={filteredTransactions}
          onUpdateTransactions={setTransactions}
          selectedAccount={selectedAccount}
        />
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        editTransaction={null}
        selectedAccount={selectedAccount}
      />
    </div>
  )
}
