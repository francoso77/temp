"use client"

import type { Transaction } from "@/lib/data"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

interface IncomeChartProps {
  transactions: Transaction[]
}

export function IncomeChart({ transactions }: IncomeChartProps) {
  // Get current month's date range
  const today = new Date()
  const startDate = startOfMonth(today)
  const endDate = endOfMonth(today)

  // Create an array of all days in the current month
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate })

  // Initialize data with all days of the month
  const chartData = daysInMonth.map((day) => {
    // Filter transactions for this day
    const dayTransactions = transactions.filter((t) => isSameDay(parseISO(t.date), day))

    // Calculate income for this day
    const income = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    return {
      date: format(day, "dd/MM", { locale: ptBR }),
      receitas: income,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => {
            // Only show every 5th day to avoid overcrowding
            const day = Number.parseInt(value.split("/")[0])
            return day % 5 === 0 ? value : ""
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
        />
        <Legend />
        <Line type="monotone" dataKey="receitas" name="Receitas" stroke="#22c55e" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
