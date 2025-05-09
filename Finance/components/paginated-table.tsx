"use client"

import type React from "react"
import { useState } from "react"
import { SortableTable } from "@/components/sortable-table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginatedTableProps<T> {
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
  pageSize?: number
  pageSizeOptions?: number[]
}

export function PaginatedTable<T>({
  data,
  columns,
  defaultSortColumn,
  defaultSortDirection = "asc",
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  // Calculate total pages
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)

  // Get current page data
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const currentData = data.slice(startIndex, endIndex)

  // Handle page changes
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
  }

  const goToFirstPage = () => goToPage(1)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToLastPage = () => goToPage(totalPages)

  // Handle page size change
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value, 10)
    setPageSize(newPageSize)
    // Reset to first page when changing page size
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      <SortableTable
        data={currentData}
        columns={columns}
        defaultSortColumn={defaultSortColumn}
        defaultSortDirection={defaultSortDirection}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{endIndex} de {totalItems} itens
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            aria-label="Primeira página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            aria-label="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} itens
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
