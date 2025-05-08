"use client"

import { type Transaction, mockCategories } from "@/lib/data"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategoryPieChartProps {
  transactions: Transaction[]
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const [chartType, setChartType] = useState<"expense" | "income">("expense")

  // Filter transactions by type
  const filteredTransactions = transactions.filter((t) => t.type === chartType)

  // Group transactions by category
  const categoryTotals = filteredTransactions.reduce(
    (acc, transaction) => {
      const categoryId = transaction.categoryId
      if (!acc[categoryId]) {
        acc[categoryId] = 0
      }
      acc[categoryId] += transaction.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Prepare data for the pie chart
  const chartData = Object.entries(categoryTotals).map(([categoryId, total]) => {
    const category = mockCategories.find((c) => c.id === categoryId)
    return {
      name: category ? category.name : "Sem categoria",
      value: total,
      color: category ? category.color : "#888888",
    }
  })

  return (
    <div className="h-[300px]">
      <div className="mb-4">
        <Select value={chartType} onValueChange={(value) => setChartType(value as "expense" | "income")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de transação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Despesas</SelectItem>
            <SelectItem value="income">Receitas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(value))
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">Não há dados para exibir</div>
      )}
    </div>
  )
}
