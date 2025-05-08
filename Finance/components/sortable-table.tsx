"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

interface SortableTableProps<T> {
  data: T[]
  columns: {
    id: string
    header: string
    cell: (item: T) => React.ReactNode
    sortable?: boolean
    sortingFn?: (a: T, b: T) => number
  }[]
  defaultSortColumn?: string
  defaultSortDirection?: "asc" | "desc"
}

export function SortableTable<T>({
  data,
  columns,
  defaultSortColumn,
  defaultSortDirection = "asc",
}: SortableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn || null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection)

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new sort column and default to ascending
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  // Sort the data
  const sortedData = [...data]
  if (sortColumn) {
    const column = columns.find((col) => col.id === sortColumn)
    if (column && column.sortable !== false) {
      sortedData.sort((a, b) => {
        let result = 0
        if (column.sortingFn) {
          result = column.sortingFn(a, b)
        } else {
          // Default sorting based on string representation
          const aValue = String(column.cell(a) || "")
          const bValue = String(column.cell(b) || "")
          result = aValue.localeCompare(bValue)
        }
        return sortDirection === "asc" ? result : -result
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                className={column.sortable !== false ? "cursor-pointer select-none" : ""}
                onClick={column.sortable !== false ? () => handleSort(column.id) : undefined}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable !== false && (
                    <span className="inline-flex">
                      {sortColumn === column.id ? (
                        sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.cell(item)}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
