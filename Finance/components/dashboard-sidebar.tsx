"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Filter, Home, PieChart, Settings, CreditCard, Wallet, Building2, Tags, BanknoteIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCategories, getDefaultAccount, type Account } from "@/lib/data"
import type { DateRange } from "react-day-picker"
import { AccountSelector } from "@/components/account-selector"
import { useState } from "react"

interface DashboardSidebarProps {
  filters: {
    dateRange: DateRange
    category: string
    type: string
    accountId?: string
  }
  setFilters: (filters: any) => void
  selectedAccount?: Account
  onAccountChange?: (account: Account) => void
}

export function DashboardSidebar({
  filters,
  setFilters,
  selectedAccount: propSelectedAccount,
  onAccountChange: propOnAccountChange,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [selectedAccount, setSelectedAccount] = useState<Account>(propSelectedAccount || getDefaultAccount())

  const handleDateRangeChange = (range: DateRange) => {
    setFilters({ ...filters, dateRange: range })
  }

  const handleAccountChange = (account: Account) => {
    setSelectedAccount(account)
    setFilters({ ...filters, accountId: account.id })
    if (propOnAccountChange) {
      propOnAccountChange(account)
    }
  }

  return (
    <div className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block w-64 overflow-y-auto">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          FinanceControl
        </h2>
      </div>
      <div className="px-4 py-6">
        <nav className="grid gap-4">
          <Button
            variant={pathname === "/" || pathname === "/dashboard" ? "default" : "ghost"}
            className="justify-start"
            asChild
          >
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant={pathname === "/transacoes" ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/transacoes">
              <CreditCard className="mr-2 h-4 w-4" />
              Transações
            </Link>
          </Button>
          <Button variant={pathname === "/contas" ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/contas">
              <BanknoteIcon className="mr-2 h-4 w-4" />
              Contas
            </Link>
          </Button>
          <Button variant={pathname === "/relatorios" ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/relatorios">
              <PieChart className="mr-2 h-4 w-4" />
              Relatórios
            </Link>
          </Button>
          <Button variant={pathname === "/empresas" ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/empresas">
              <Building2 className="mr-2 h-4 w-4" />
              Empresas
            </Link>
          </Button>
          <Button variant={pathname === "/categorias" ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/categorias">
              <Tags className="mr-2 h-4 w-4" />
              Categorias
            </Link>
          </Button>
          <Button variant={pathname === "/configuracoes" ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/configuracoes">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>
          </Button>
        </nav>
      </div>
      <div className="px-4 py-6 border-t">
        <h3 className="mb-4 text-sm font-medium flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Conta</label>
            <AccountSelector
              selectedAccount={propSelectedAccount || selectedAccount}
              onAccountChange={handleAccountChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <DateRangePicker dateRange={filters.dateRange} onDateRangeChange={handleDateRangeChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
