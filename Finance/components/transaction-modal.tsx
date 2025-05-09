"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Transaction, mockCategories, mockCompanies, type Account, mockAccounts } from "@/lib/data"
import { v4 as uuidv4 } from "uuid"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTransaction: (transaction: Transaction) => void
  editTransaction?: Transaction | null
  selectedAccount?: Account
}

export function TransactionModal({
  isOpen,
  onClose,
  onAddTransaction,
  editTransaction,
  selectedAccount,
}: TransactionModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    categoryId: "",
    companyId: "",
    accountId: selectedAccount?.id || mockAccounts[0].id,
    date: new Date().toISOString().split("T")[0],
  })

  // Reset form when modal opens or editTransaction changes
  useEffect(() => {
    if (isOpen) {
      if (editTransaction) {
        // Populate form with transaction data
        setFormData({
          description: editTransaction.description,
          amount: editTransaction.amount.toString(),
          type: editTransaction.type,
          categoryId: editTransaction.categoryId,
          companyId: editTransaction.companyId,
          accountId: editTransaction.accountId,
          date: new Date(editTransaction.date).toISOString().split("T")[0],
        })
      } else {
        // Reset form for new transaction
        setFormData({
          description: "",
          amount: "",
          type: "expense",
          categoryId: "",
          companyId: "",
          accountId: selectedAccount?.id || mockAccounts[0].id,
          date: new Date().toISOString().split("T")[0],
        })
      }
    }
  }, [isOpen, editTransaction, selectedAccount])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const transactionData: Transaction = {
      id: editTransaction ? editTransaction.id : uuidv4(),
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      type: formData.type as "income" | "expense",
      categoryId: formData.categoryId,
      companyId: formData.companyId,
      accountId: formData.accountId,
      date: new Date(formData.date).toISOString(),
    }

    onAddTransaction(transactionData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTransaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account">Conta</Label>
              <Select
                value={formData.accountId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, accountId: value }))}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {mockAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories
                    .filter((category) => category.type === formData.type || category.type === "both")
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, companyId: value }))}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{editTransaction ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
