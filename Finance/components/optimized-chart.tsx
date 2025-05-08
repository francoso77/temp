"use client"

import { useMemo } from "react"
import type { Transaction } from "@/lib/data"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { format, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ChartProps {
  transactions: Transaction[]
  type: "bar" | "line"
  period: "daily" | "monthly" | "yearly"
  showIncome?: boolean
  showExpense?: boolean
  height?: number
}

export function OptimizedChart({
  transactions,
  type = "bar",
  period = "monthly",
  showIncome = true,
  showExpense = true,
  height = 300,
}: ChartProps) {
  // Usar useMemo para calcular os dados do gráfico apenas quando as dependências mudarem
  const chartData = useMemo(() => {
    // Função para agrupar transações por período
    const groupTransactionsByPeriod = () => {
      const result: Record<string, { date: string; receitas: number; despesas: number; balance: number }> = {}

      // Definir o formato da data com base no período
      const dateFormat = period === "daily" ? "dd/MM" : period === "monthly" ? "MMM/yyyy" : "yyyy"

      // Pré-popular o resultado com períodos vazios para garantir continuidade no gráfico
      if (period === "daily") {
        // Últimos 30 dias
        for (let i = 29; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const key = format(date, dateFormat, { locale: ptBR })
          result[key] = { date: key, receitas: 0, despesas: 0, balance: 0 }
        }
      } else if (period === "monthly") {
        // Últimos 12 meses
        for (let i = 11; i >= 0; i--) {
          const date = subMonths(new Date(), i)
          const key = format(date, dateFormat, { locale: ptBR })
          result[key] = { date: key, receitas: 0, despesas: 0, balance: 0 }
        }
      } else {
        // Últimos 5 anos
        const currentYear = new Date().getFullYear()
        for (let year = currentYear - 4; year <= currentYear; year++) {
          const key = year.toString()
          result[key] = { date: key, receitas: 0, despesas: 0, balance: 0 }
        }
      }

      // Processar transações
      transactions.forEach((transaction) => {
        const date = new Date(transaction.date)
        const key = format(date, dateFormat, { locale: ptBR })

        // Verificar se o período está dentro do intervalo que queremos mostrar
        if (!result[key]) {
          if (period === "daily") {
            // Verificar se está nos últimos 30 dias
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            if (date < thirtyDaysAgo) return
          } else if (period === "monthly") {
            // Verificar se está nos últimos 12 meses
            const twelveMonthsAgo = subMonths(new Date(), 12)
            if (date < twelveMonthsAgo) return
          } else {
            // Verificar se está nos últimos 5 anos
            const currentYear = new Date().getFullYear()
            if (date.getFullYear() < currentYear - 4) return
          }

          // Se chegou aqui, é um período válido que não foi pré-populado
          result[key] = { date: key, receitas: 0, despesas: 0, balance: 0 }
        }

        // Atualizar valores
        if (transaction.type === "income") {
          result[key].receitas += transaction.amount
        } else {
          result[key].despesas += transaction.amount
        }
        result[key].balance = result[key].receitas - result[key].despesas
      })

      // Converter o objeto em array e ordenar
      return Object.values(result).sort((a, b) => {
        if (period === "yearly") {
          return Number.parseInt(a.date) - Number.parseInt(b.date)
        }

        // Para daily e monthly, precisamos de uma lógica mais complexa
        if (period === "daily") {
          const [dayA, monthA] = a.date.split("/").map(Number)
          const [dayB, monthB] = b.date.split("/").map(Number)

          if (monthA !== monthB) return monthA - monthB
          return dayA - dayB
        }

        // Para monthly
        const [monthA, yearA] = a.date.split("/")
        const [monthB, yearB] = b.date.split("/")

        if (yearA !== yearB) return Number.parseInt(yearA) - Number.parseInt(yearB)

        // Converter mês abreviado para número
        const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
        return monthNames.indexOf(monthA.toLowerCase()) - monthNames.indexOf(monthB.toLowerCase())
      })
    }

    return groupTransactionsByPeriod()
  }, [transactions, period])

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Formatar valores do eixo Y
  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  // Renderizar o gráfico apropriado
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    }

    if (type === "bar") {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickFormatter={(value) => {
              // Mostrar menos ticks para evitar sobreposição
              if (period === "daily" && chartData.length > 15) {
                const index = chartData.findIndex((item) => item.date === value)
                return index % 3 === 0 ? value : ""
              }
              return value
            }}
          />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `Período: ${label}`}
          />
          <Legend />
          {showIncome && <Bar dataKey="receitas" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />}
          {showExpense && <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />}
        </BarChart>
      )
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickMargin={10}
          tickFormatter={(value) => {
            if (period === "daily" && chartData.length > 15) {
              const index = chartData.findIndex((item) => item.date === value)
              return index % 3 === 0 ? value : ""
            }
            return value
          }}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => `Período: ${label}`} />
        <Legend />
        {showIncome && (
          <Line
            type="monotone"
            dataKey="receitas"
            name="Receitas"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        )}
        {showExpense && (
          <Line
            type="monotone"
            dataKey="despesas"
            name="Despesas"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        )}
      </LineChart>
    )
  }

  return (
    <div className="h-full w-full">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Não há dados para exibir neste período
        </div>
      )}
    </div>
  )
}
