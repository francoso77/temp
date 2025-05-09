"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid"
import type { Account } from "@/lib/data"

interface AccountFormProps {
  account?: Account
  onSubmit: (account: Account) => void
  onCancel?: () => void
}

export function AccountForm({ account, onSubmit, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState<Omit<Account, "id">>({
    name: account?.name || "",
    type: account?.type || "checking",
    initialBalance: account?.initialBalance || 0,
    currency: account?.currency || "BRL",
    color: account?.color || "#3b82f6",
    isDefault: account?.isDefault || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newAccount: Account = {
      id: account?.id || uuidv4(),
      ...formData,
    }

    onSubmit(newAccount)
  }

  const handleChange = (field: keyof Omit<Account, "id">, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Conta</Label>
        <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Conta</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "checking" | "savings" | "investment" | "credit" | "cash" | "other") =>
            handleChange("type", value)
          }
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo de conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Conta Corrente</SelectItem>
            <SelectItem value="savings">Poupança</SelectItem>
            <SelectItem value="investment">Investimentos</SelectItem>
            <SelectItem value="credit">Cartão de Crédito</SelectItem>
            <SelectItem value="cash">Dinheiro</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="initialBalance">Saldo Inicial</Label>
        <Input
          id="initialBalance"
          type="number"
          step="0.01"
          value={formData.initialBalance}
          onChange={(e) => handleChange("initialBalance", Number.parseFloat(e.target.value) || 0)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Moeda</Label>
        <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
          <SelectTrigger id="currency">
            <SelectValue placeholder="Selecione a moeda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BRL">Real (BRL)</SelectItem>
            <SelectItem value="USD">Dólar (USD)</SelectItem>
            <SelectItem value="EUR">Euro (EUR)</SelectItem>
            <SelectItem value="GBP">Libra (GBP)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <div className="flex gap-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-12 h-10 p-1"
          />
          <Input value={formData.color} onChange={(e) => handleChange("color", e.target.value)} className="flex-1" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">{account ? "Salvar" : "Adicionar"}</Button>
      </div>
    </form>
  )
}
