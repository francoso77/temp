"use client"

import { useState } from "react"
import type { Transaction } from "@/lib/data"
import { OptimizedChart } from "@/components/optimized-chart"
import { ChartControls } from "@/components/chart-controls"

interface FinancialChartProps {
  transactions: Transaction[]
  title?: string
  height?: number
}

export function FinancialChart({ transactions, title, height = 300 }: FinancialChartProps) {
  const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("monthly")
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [showIncome, setShowIncome] = useState(true)
  const [showExpense, setShowExpense] = useState(true)

  return (
    <div className="h-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}

      <ChartControls
        onPeriodChange={setPeriod}
        onTypeChange={setChartType}
        onToggleIncome={setShowIncome}
        onToggleExpense={setShowExpense}
        showIncome={showIncome}
        showExpense={showExpense}
      />

      <OptimizedChart
        transactions={transactions}
        type={chartType}
        period={period}
        showIncome={showIncome}
        showExpense={showExpense}
        height={height}
      />
    </div>
  )
}
