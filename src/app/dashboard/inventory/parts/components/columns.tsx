"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Part } from "@prisma/client"
import { ArrowUpDown, MoreHorizontal, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount)
  }

export const columns: ColumnDef<Part>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "cost",
    header: "Costo",
    cell: ({ row }) => formatCurrency(row.original.cost),
  },
  {
    accessorKey: "stock",
    header: "Stock Actual",
    cell: ({ row }) => {
        const part = row.original
        const isLowStock = part.stock <= part.minStock
        return (
            <div className="flex items-center">
                <span>{part.stock}</span>
                {isLowStock && <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />}
            </div>
        )
    }
  },
  {
    accessorKey: "minStock",
    header: "Stock Mínimo",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const part = row.original

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(part.sku)}
            >
              Copiar SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar repuesto</DropdownMenuItem>
            <DropdownMenuItem>Ver movimientos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 