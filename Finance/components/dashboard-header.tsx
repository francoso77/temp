"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Bell } from "lucide-react"
import { UserDropdown } from "@/components/user-dropdown"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccountSelector } from "@/components/account-selector"
import { useState } from "react"
import { getDefaultAccount, type Account } from "@/lib/data"

interface DashboardHeaderProps {
  onAddTransaction: () => void
  selectedAccount?: Account
  onAccountChange?: (account: Account) => void
}

export function DashboardHeader({
  onAddTransaction,
  selectedAccount: propSelectedAccount,
  onAccountChange: propOnAccountChange,
}: DashboardHeaderProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account>(propSelectedAccount || getDefaultAccount())

  const handleAccountChange = (account: Account) => {
    setSelectedAccount(account)
    if (propOnAccountChange) {
      propOnAccountChange(account)
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div className="flex h-16 items-center px-4 md:px-6">
        <h1 className="text-xl font-semibold">Dashboard Financeiro</h1>
        <div className="ml-auto flex items-center gap-4">
          <AccountSelector
            selectedAccount={propSelectedAccount || selectedAccount}
            onAccountChange={handleAccountChange}
            className="w-[200px] hidden md:block"
          />
          <Button onClick={onAddTransaction} size="sm" className="h-9">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
