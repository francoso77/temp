// Importar o gerador de dados de teste
import { generateMockTransactions } from "./mock-data-generator"

export interface Transaction {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  categoryId: string
  companyId: string
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
  { id: "comp1", name: "TechSolutions Inc." },
  { id: "comp2", name: "Marketing Pro" },
  { id: "comp3", name: "CloudServices SA" },
  { id: "comp4", name: "Consultoria XYZ" },
  { id: "comp5", name: "Distribuidora ABC" },
]

// Usar o gerador para criar dados mais realistas
export const mockTransactions: Transaction[] = generateMockTransactions(200)
