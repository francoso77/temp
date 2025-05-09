import { v4 as uuidv4 } from "uuid"
import type { Transaction } from "./data"

// Função para gerar dados de transações mais realistas para testes
export function generateMockTransactions(count = 200): Transaction[] {
  const transactions: Transaction[] = []
  const currentDate = new Date()
  const startDate = new Date(currentDate)
  startDate.setFullYear(currentDate.getFullYear() - 2) // Dados dos últimos 2 anos

  const categoryIds = [
    "cat1",
    "cat2",
    "cat3",
    "cat4", // Receitas
    "cat5",
    "cat6",
    "cat7",
    "cat8",
    "cat9",
    "cat10", // Despesas
  ]

  const companyIds = ["comp1", "comp2", "comp3", "comp4", "comp5"]

  const incomeDescriptions = [
    "Venda de software",
    "Consultoria técnica",
    "Serviços de hospedagem",
    "Dividendos",
    "Venda de licenças",
    "Serviços de suporte",
    "Reembolso de despesas",
  ]

  const expenseDescriptions = [
    "Folha de pagamento",
    "Campanha de marketing",
    "Aluguel do escritório",
    "Licenças de software",
    "Impostos",
    "Material de escritório",
    "Serviços de internet",
    "Manutenção de equipamentos",
    "Consultoria jurídica",
    "Assinatura de serviços cloud",
  ]

  // Gerar transações para cada mês nos últimos 2 anos
  for (let i = 0; i < 24; i++) {
    const monthDate = new Date(currentDate)
    monthDate.setMonth(currentDate.getMonth() - i)

    // Número de transações por mês (variando entre 5-15)
    const transactionsPerMonth = 5 + Math.floor(Math.random() * 10)

    for (let j = 0; j < transactionsPerMonth; j++) {
      // Gerar data aleatória dentro do mês
      const transactionDate = new Date(monthDate)
      transactionDate.setDate(1 + Math.floor(Math.random() * 28)) // Dia entre 1-28

      // Determinar se é receita ou despesa (40% receita, 60% despesa)
      const type = Math.random() < 0.4 ? "income" : "expense"

      // Selecionar categoria apropriada
      let categoryId
      if (type === "income") {
        categoryId = categoryIds[Math.floor(Math.random() * 4)] // Categorias de receita
      } else {
        categoryId = categoryIds[4 + Math.floor(Math.random() * 6)] // Categorias de despesa
      }

      // Selecionar empresa aleatória
      const companyId = companyIds[Math.floor(Math.random() * companyIds.length)]

      // Selecionar descrição apropriada
      const description =
        type === "income"
          ? incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)]
          : expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)]

      // Gerar valor aleatório (receitas tendem a ser maiores)
      const amount =
        type === "income" ? 1000 + Math.floor(Math.random() * 10000) : 100 + Math.floor(Math.random() * 5000)

      transactions.push({
        id: uuidv4(),
        description,
        amount,
        type,
        categoryId,
        companyId,
        accountId: "acc1", // Valor padrão, será substituído depois
        date: transactionDate.toISOString(),
      })
    }
  }

  // Adicionar algumas transações para os últimos 30 dias para garantir dados recentes
  for (let i = 0; i < 30; i++) {
    const dayDate = new Date()
    dayDate.setDate(dayDate.getDate() - i)

    // 50% de chance de ter uma transação neste dia
    if (Math.random() > 0.5) {
      const type = Math.random() < 0.4 ? "income" : "expense"

      let categoryId
      if (type === "income") {
        categoryId = categoryIds[Math.floor(Math.random() * 4)]
      } else {
        categoryId = categoryIds[4 + Math.floor(Math.random() * 6)]
      }

      const companyId = companyIds[Math.floor(Math.random() * companyIds.length)]

      const description =
        type === "income"
          ? incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)]
          : expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)]

      const amount =
        type === "income" ? 1000 + Math.floor(Math.random() * 10000) : 100 + Math.floor(Math.random() * 5000)

      transactions.push({
        id: uuidv4(),
        description,
        amount,
        type,
        categoryId,
        companyId,
        accountId: "acc1", // Valor padrão, será substituído depois
        date: dayDate.toISOString(),
      })
    }
  }

  // Ordenar por data (mais recente primeiro)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
