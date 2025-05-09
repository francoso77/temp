"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockAccounts, type Account, getAccountBalance, mockTransactions } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AccountForm } from "@/components/account-form"
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
import { Edit, Trash2, Plus, CreditCard, Wallet, PiggyBank, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const { toast } = useToast()
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    category: "all",
    type: "all",
  })

  const handleAddAccount = (account: Account) => {
    // Se a nova conta for definida como padrão, remover o padrão das outras
    let updatedAccounts = [...accounts]
    if (account.isDefault) {
      updatedAccounts = updatedAccounts.map((acc) => ({
        ...acc,
        isDefault: false,
      }))
    }

    // Adicionar a nova conta
    setAccounts([...updatedAccounts, account])
    setIsAddDialogOpen(false)
    toast({
      title: "Conta adicionada",
      description: `A conta "${account.name}" foi adicionada com sucesso.`,
    })
  }

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsEditDialogOpen(true)
  }

  const handleUpdateAccount = (updatedAccount: Account) => {
    // Se a conta atualizada for definida como padrão, remover o padrão das outras
    let newAccounts = [...accounts]
    if (updatedAccount.isDefault) {
      newAccounts = newAccounts.map((acc) => ({
        ...acc,
        isDefault: acc.id === updatedAccount.id ? true : false,
      }))
    }

    // Atualizar a conta
    setAccounts(newAccounts.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)))
    setIsEditDialogOpen(false)
    setSelectedAccount(null)
    toast({
      title: "Conta atualizada",
      description: `A conta "${updatedAccount.name}" foi atualizada com sucesso.`,
    })
  }

  const handleDeleteAccount = (account: Account) => {
    setSelectedAccount(account)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteAccount = () => {
    if (selectedAccount) {
      // Verificar se é a última conta
      if (accounts.length === 1) {
        toast({
          title: "Erro ao excluir",
          description: "Não é possível excluir a única conta do sistema.",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setSelectedAccount(null)
        return
      }

      // Verificar se é a conta padrão
      if (selectedAccount.isDefault) {
        toast({
          title: "Erro ao excluir",
          description: "Não é possível excluir a conta padrão. Defina outra conta como padrão primeiro.",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        setSelectedAccount(null)
        return
      }

      // Excluir a conta
      setAccounts(accounts.filter((acc) => acc.id !== selectedAccount.id))
      toast({
        title: "Conta excluída",
        description: `A conta "${selectedAccount.name}" foi excluída com sucesso.`,
      })
    }
    setIsDeleteDialogOpen(false)
    setSelectedAccount(null)
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "checking":
        return <CreditCard className="h-4 w-4" />
      case "savings":
        return <PiggyBank className="h-4 w-4" />
      case "investment":
        return <DollarSign className="h-4 w-4" />
      case "credit":
        return <CreditCard className="h-4 w-4" />
      case "cash":
        return <Wallet className="h-4 w-4" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case "checking":
        return "Conta Corrente"
      case "savings":
        return "Poupança"
      case "investment":
        return "Investimentos"
      case "credit":
        return "Cartão de Crédito"
      case "cash":
        return "Dinheiro"
      default:
        return "Outro"
    }
  }

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar filters={filters} setFilters={setFilters} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onAddTransaction={() => {}} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">Contas</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {accounts.map((account) => {
              const currentBalance = getAccountBalance(account.id, mockTransactions)
              return (
                <Card key={account.id} className="overflow-hidden">
                  <div className="h-2" style={{ backgroundColor: account.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {getAccountIcon(account.type)}
                        <CardTitle className="ml-2 text-base">{account.name}</CardTitle>
                      </div>
                      {account.isDefault && (
                        <Badge variant="outline" className="ml-2">
                          Padrão
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{getAccountTypeName(account.type)}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Saldo Inicial</div>
                        <div className="font-medium">{formatCurrency(account.initialBalance, account.currency)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Saldo Atual</div>
                        <div className="text-xl font-bold">{formatCurrency(currentBalance, account.currency)}</div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAccount(account)}
                          disabled={account.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Contas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cor</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Saldo Inicial</TableHead>
                    <TableHead>Saldo Atual</TableHead>
                    <TableHead>Moeda</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => {
                    const currentBalance = getAccountBalance(account.id, mockTransactions)
                    return (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: account.color }} />
                        </TableCell>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{getAccountTypeName(account.type)}</TableCell>
                        <TableCell>{formatCurrency(account.initialBalance, account.currency)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(currentBalance, account.currency)}
                        </TableCell>
                        <TableCell>{account.currency}</TableCell>
                        <TableCell>{account.isDefault ? <Badge variant="outline">Padrão</Badge> : null}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAccount(account)}
                              disabled={account.isDefault}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Diálogo para adicionar conta */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
          </DialogHeader>
          <AccountForm onSubmit={handleAddAccount} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar conta */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Conta</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <AccountForm
              account={selectedAccount}
              onSubmit={handleUpdateAccount}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedAccount(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para excluir conta */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
              {selectedAccount?.isDefault && (
                <p className="mt-2 font-semibold text-destructive">
                  Não é possível excluir a conta padrão. Defina outra conta como padrão primeiro.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAccount(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAccount}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
