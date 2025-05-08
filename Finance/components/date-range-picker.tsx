"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ dateRange, onDateRangeChange, className }: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [fromInput, setFromInput] = React.useState("")
  const [toInput, setToInput] = React.useState("")

  // Atualiza os inputs quando o dateRange muda
  React.useEffect(() => {
    if (dateRange.from) {
      setFromInput(format(dateRange.from, "dd/MM/yyyy"))
    }
    if (dateRange.to) {
      setToInput(format(dateRange.to, "dd/MM/yyyy"))
    }
  }, [dateRange])

  // Corrigir o problema com a validação e formatação de datas
  // Substituir a função parseDate e adicionar validação mais robusta

  // Função para converter string de data (DD/MM/YYYY) para objeto Date
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined

    // Validar o formato DD/MM/YYYY com regex
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = dateString.match(regex)
    if (!match) return undefined

    const day = Number.parseInt(match[1], 10)
    const month = Number.parseInt(match[2], 10) - 1 // Mês em JS é 0-indexed
    const year = Number.parseInt(match[3], 10)

    // Validar valores de dia, mês e ano
    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 0 ||
      month > 11 ||
      year < 1900 ||
      year > 2100
    ) {
      return undefined
    }

    const date = new Date(year, month, day)

    // Verificar se a data é válida (ex: 31/02/2023 não é válido)
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      return undefined
    }

    return date
  }

  // Modificar os handlers para melhor validação e feedback
  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromInput(value)

    const date = parseDate(value)
    if (date) {
      onDateRangeChange({ ...dateRange, from: date })
    }
  }

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setToInput(value)

    const date = parseDate(value)
    if (date) {
      onDateRangeChange({ ...dateRange, to: date })
    }
  }

  // Adicionar função para aplicar o intervalo de datas manualmente
  const applyManualDateRange = () => {
    const fromDate = parseDate(fromInput)
    const toDate = parseDate(toInput)

    if (fromDate && toDate) {
      onDateRangeChange({ from: fromDate, to: toDate })
      setIsPopoverOpen(false)
    }
  }

  // Opções de período pré-definidas
  const predefinedRanges = [
    {
      label: "Hoje",
      onClick: () => {
        const today = new Date()
        onDateRangeChange({ from: today, to: today })
        setIsPopoverOpen(false)
      },
    },
    {
      label: "Últimos 7 dias",
      onClick: () => {
        const today = new Date()
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(today.getDate() - 6)
        onDateRangeChange({ from: sevenDaysAgo, to: today })
        setIsPopoverOpen(false)
      },
    },
    {
      label: "Este mês",
      onClick: () => {
        const today = new Date()
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        onDateRangeChange({ from: firstDayOfMonth, to: today })
        setIsPopoverOpen(false)
      },
    },
    {
      label: "Mês passado",
      onClick: () => {
        const today = new Date()
        const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        onDateRangeChange({ from: firstDayOfLastMonth, to: lastDayOfLastMonth })
        setIsPopoverOpen(false)
      },
    },
    {
      label: "Este ano",
      onClick: () => {
        const today = new Date()
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
        onDateRangeChange({ from: firstDayOfYear, to: today })
        setIsPopoverOpen(false)
      },
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Período personalizado</h4>
              <div className="flex gap-2">
                <div className="grid gap-1">
                  <label htmlFor="from-date" className="text-xs">
                    De
                  </label>
                  <Input
                    id="from-date"
                    placeholder="DD/MM/AAAA"
                    value={fromInput}
                    onChange={handleFromInputChange}
                    className="w-[120px]"
                  />
                </div>
                <div className="grid gap-1">
                  <label htmlFor="to-date" className="text-xs">
                    Até
                  </label>
                  <Input
                    id="to-date"
                    placeholder="DD/MM/AAAA"
                    value={toInput}
                    onChange={handleToInputChange}
                    className="w-[120px]"
                  />
                </div>
                <div className="flex items-end">
                  <Button size="sm" onClick={applyManualDateRange}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h4 className="font-medium text-sm mb-2">Períodos pré-definidos</h4>
              <div className="flex flex-wrap gap-1">
                {predefinedRanges.map((range, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={range.onClick} className="text-xs">
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={applyManualDateRange} className="w-full mt-2">
              Aplicar
            </Button>
          </div>

          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={(range) => {
              if (range) {
                onDateRangeChange(range)
              }
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
