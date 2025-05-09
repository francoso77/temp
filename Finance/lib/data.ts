// Importar o gerador de dados de teste
import { generateMockTransactions } from "./mock-data-generator"

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  categoryId: string
  companyId: string
  accountId: string // Nova propriedade para associar a transação a uma conta
  date: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense" | "both"
  color: string
}

export interface Company {
  id: string
  name: string
}

// Nova interface para Contas
export interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "investment" | "credit" | "cash" | "other"
  initialBalance: number
  currency: string
  color: string
  isDefault?: boolean
}

// Mock data para contas
export const mockAccounts: Account[] = [
  {
    id: "acc1",
    name: "Conta Corrente",
    type: "checking",
    initialBalance: 5000,
    currency: "BRL",
    color: "#3b82f6",
    isDefault: true,
  },
  {
    id: "acc2",
    name: "Poupança",
    type: "savings",
    initialBalance: 10000,
    currency: "BRL",
    color: "#22c55e",
  },
  {
    id: "acc3",
    name: "Investimentos",
    type: "investment",
    initialBalance: 20000,
    currency: "BRL",
    color: "#a855f7",
  },
  {
    id: "acc4",
    name: "Cartão de Crédito",
    type: "credit",
    initialBalance: 0,
    currency: "BRL",
    color: "#ef4444",
  },
  {
    id: "acc5",
    name: "Dinheiro",
    type: "cash",
    initialBalance: 500,
    currency: "BRL",
    color: "#f59e0b",
  },
]

// Mock data for categories
export const mockCategories: Category[] = [
  { id: "cat1", name: "Vendas", type: "income", color: "#4ade80" },
  { id: "cat2", name: "Serviços", type: "income", color: "#22d3ee" },
  { id: "cat3", name: "Investimentos", type: "income", color: "#a78bfa" },
  { id: "cat4", name: "Outros Recebimentos", type: "income", color: "#2dd4bf" },
  { id: "cat5", name: "Salários", type: "expense", color: "#f87171" },
  { id: "cat6", name: "Marketing", type: "expense", color: "#fb923c" },
  { id: "cat7", name: "Infraestrutura", type: "expense", color: "#facc15" },
  { id: "cat8", name: "Software", type: "expense", color: "#c084fc" },
  { id: "cat9", name: "Impostos", type: "expense", color: "#f43f5e" },
  { id: "cat10", name: "Escritório", type: "expense", color: "#38bdf8" },
]

// Mock data for companies
export const mockCompanies: Company[] = [
  { id: "comp1", name: "Minha Empresa Ltda." },
  { id: "comp2", name: "Marketing Pro" },
  { id: "comp3", name: "CloudServices SA" },
  { id: "comp4", name: "Consultoria XYZ" },
  { id: "comp5", name: "Distribuidora ABC" },
]

// Modificar o gerador para incluir contas
const rawTransactions = generateMockTransactions(200)

// Distribuir as transações entre as contas
export const mockTransactions: Transaction[] = rawTransactions.map((transaction) => {
  // Distribuir as transações entre as contas de forma aleatória, mas com maior probabilidade para a conta padrão
  const randomValue = Math.random()
  let accountId

  if (randomValue < 0.4) {
    accountId = "acc1" // 40% para conta corrente (padrão)
  } else if (randomValue < 0.6) {
    accountId = "acc2" // 20% para poupança
  } else if (randomValue < 0.75) {
    accountId = "acc3" // 15% para investimentos
  } else if (randomValue < 0.9) {
    accountId = "acc4" // 15% para cartão de crédito
  } else {
    accountId = "acc5" // 10% para dinheiro
  }

  return {
    ...transaction,
    accountId,
  }
})

// Função para calcular o saldo atual de uma conta
export function getAccountBalance(accountId: string, transactions: Transaction[]): number {
  const account = mockAccounts.find((acc) => acc.id === accountId)
  if (!account) return 0

  const accountTransactions = transactions.filter((t) => t.accountId === accountId)
  const income = accountTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = accountTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return account.initialBalance + income - expenses
}

// Função para obter a conta padrão
export function getDefaultAccount(): Account {
  return mockAccounts.find((acc) => acc.isDefault) || mockAccounts[0]
}
