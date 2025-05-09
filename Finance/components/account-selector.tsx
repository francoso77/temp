"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { mockAccounts, type Account } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AccountForm } from "@/components/account-form"

interface AccountSelectorProps {
  selectedAccount: Account
  onAccountChange: (account: Account) => void
  onAccountsChange?: (accounts: Account[]) => void
  className?: string
}

export function AccountSelector({
  selectedAccount,
  onAccountChange,
  onAccountsChange,
  className,
}: AccountSelectorProps) {
  const [open, setOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [showNewAccountDialog, setShowNewAccountDialog] = useState(false)

  // Atualizar a conta selecionada se ela não existir mais na lista
  useEffect(() => {
    if (!accounts.find((acc) => acc.id === selectedAccount.id)) {
      onAccountChange(accounts[0])
    }
  }, [accounts, selectedAccount, onAccountChange])

  const handleAccountCreate = (newAccount: Account) => {
    const updatedAccounts = [...accounts, newAccount]
    setAccounts(updatedAccounts)
    if (onAccountsChange) {
      onAccountsChange(updatedAccounts)
    }
    setShowNewAccountDialog(false)
    onAccountChange(newAccount)
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: selectedAccount.color }} />
              {selectedAccount.name}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar conta..." />
            <CommandList>
              <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>
              <CommandGroup heading="Suas contas">
                {accounts.map((account) => (
                  <CommandItem
                    key={account.id}
                    value={account.id}
                    onSelect={() => {
                      onAccountChange(account)
                      setOpen(false)
                    }}
                  >
                    <div className="mr-2 h-4 w-4 rounded-full" style={{ backgroundColor: account.color }} />
                    <span>{account.name}</span>
                    <Check
                      className={cn("ml-auto h-4 w-4", selectedAccount.id === account.id ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Dialog open={showNewAccountDialog} onOpenChange={setShowNewAccountDialog}>
                  <DialogTrigger asChild>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false)
                        setShowNewAccountDialog(true)
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      <span>Adicionar nova conta</span>
                    </CommandItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nova Conta</DialogTitle>
                    </DialogHeader>
                    <AccountForm onSubmit={handleAccountCreate} />
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
