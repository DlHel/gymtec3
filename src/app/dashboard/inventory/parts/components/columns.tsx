"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Part } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { CellActions } from "./CellActions"

// Definir las columnas de la tabla de repuestos
export const columns: ColumnDef<Part>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      const sku = row.getValue("sku")
      return sku ? <span className="font-mono text-sm">{sku as string}</span> : <span className="text-muted-foreground">N/A</span>
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stock") as number
      const minStock = row.original.minStock
      
      return (
        <Badge variant={stock <= minStock ? "destructive" : "secondary"}>
          {stock}
        </Badge>
      )
    },
  },
  {
    accessorKey: "minStock", 
    header: "Stock Mínimo",
  },
  {
    accessorKey: "cost",
    header: "Costo",
    cell: ({ row }) => {
      const cost = row.getValue("cost") as number
      return cost ? `$${cost.toLocaleString()}` : <span className="text-muted-foreground">N/A</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions part={row.original} />,
  },
] 