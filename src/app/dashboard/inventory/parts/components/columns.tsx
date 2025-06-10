"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"

export type PartColumn = {
  id: string
  name: string
  sku: string | null
  cost: number | null
  stock: number
  minStock: number
  supplierName: string
  isLowStock: boolean
}

// Definir las columnas de la tabla de repuestos
export const columns: ColumnDef<PartColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "stock",
    header: "Stock Actual",
    cell: ({ row }) => {
      const { stock, isLowStock } = row.original
      return (
        <div
          className={cn('flex items-center', {
            'text-red-600 font-medium': isLowStock,
          })}
        >
          {isLowStock && <AlertCircle className="mr-2 h-4 w-4" />}
          {stock}
        </div>
      )
    },
  },
  {
    accessorKey: "minStock",
    header: "Stock Mínimo",
  },
  {
    accessorKey: "cost",
    header: "Costo Unitario",
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue('cost') || '0')
      const formatted = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
      }).format(cost)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "supplierName",
    header: "Proveedor",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>Ajustar Stock</DropdownMenuItem>
            <DropdownMenuItem>Ver Movimientos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 