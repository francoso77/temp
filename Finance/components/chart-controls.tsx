"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, LineChart, Calendar } from "lucide-react"

interface ChartControlsProps {
  onPeriodChange: (period: "daily" | "monthly" | "yearly") => void
  onTypeChange: (type: "bar" | "line") => void
  onToggleIncome: (show: boolean) => void
  onToggleExpense: (show: boolean) => void
  showIncome: boolean
  showExpense: boolean
}

export function ChartControls({
  onPeriodChange,
  onTypeChange,
  onToggleIncome,
  onToggleExpense,
  showIncome,
  showExpense,
}: ChartControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTypeChange("bar")}
          className={`px-2 ${showIncome && showExpense ? "" : "opacity-50"}`}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="sr-only">Gráfico de Barras</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onTypeChange("line")} className="px-2">
          <LineChart className="h-4 w-4" />
          <span className="sr-only">Gráfico de Linha</span>
        </Button>
        <Button
          variant={showIncome ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleIncome(!showIncome)}
          className="text-xs"
        >
          Receitas
        </Button>
        <Button
          variant={showExpense ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleExpense(!showExpense)}
          className="text-xs"
        >
          Despesas
        </Button>
      </div>

      <Select onValueChange={(value: "daily" | "monthly" | "yearly") => onPeriodChange(value)} defaultValue="monthly">
        <SelectTrigger className="w-[140px]">
          <Calendar className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Diário</SelectItem>
          <SelectItem value="monthly">Mensal</SelectItem>
          <SelectItem value="yearly">Anual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
