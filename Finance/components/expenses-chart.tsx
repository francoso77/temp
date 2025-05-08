"use client"

import type { Transaction } from "@/lib/data"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, parseISO, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExpensesChartProps {
  transactions: Transaction[]
}

export function ExpensesChart({ transactions }: ExpensesChartProps) {
  const [viewMode, setViewMode] = useState<"daily" | "monthly" | "yearly">("monthly")

  // Função para gerar dados do gráfico com base no modo de visualização
  const generateChartData = () => {
    const today = new Date()

    if (viewMode === "monthly") {
      // Dados dos últimos 12 meses
      const startDate = subMonths(today, 11)
      const months = eachMonthOfInterval({ start: startDate, end: today })

      return months.map((month) => {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)
        const monthTransactions = transactions.filter((t) => {
          const date = parseISO(t.date)
          return date >= monthStart && date <= monthEnd
        })

        const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const expenses = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
          date: format(month, "MMM/yyyy", { locale: ptBR }),
          receitas: income,
          despesas: expenses,
          balance: income - expenses,
        }
      })
    } else if (viewMode === "yearly") {
      // Dados por ano
      const years = Array.from(new Set(transactions.map((t) => new Date(t.date).getFullYear()))).sort((a, b) => a - b)

      return years.map((year) => {
        const yearTransactions = transactions.filter((t) => new Date(t.date).getFullYear() === year)

        const income = yearTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const expenses = yearTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
          date: year.toString(),
          receitas: income,
          despesas: expenses,
          balance: income - expenses,
        }
      })
    } else {
      // Dados diários (últimos 30 dias)
      const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date
      }).reverse()

      return days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd")
        const dayTransactions = transactions.filter((t) => t.date.startsWith(dayStr))

        const income = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

        const expenses = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
          date: format(day, "dd/MM", { locale: ptBR }),
          receitas: income,
          despesas: expenses,
          balance: income - expenses,
        }
      })
    }
  }

  const chartData = generateChartData()

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Evolução Financeira</h3>
        <Select value={viewMode} onValueChange={(value: "daily" | "monthly" | "yearly") => setViewMode(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Visualização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diária</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => {
              // Mostrar menos ticks para evitar sobreposição
              if (viewMode === "daily" && chartData.length > 15) {
                const index = chartData.findIndex((item) => item.date === value)
                return index % 3 === 0 ? value : ""
              }
              return value
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(value))
            }
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Legend />
          <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
