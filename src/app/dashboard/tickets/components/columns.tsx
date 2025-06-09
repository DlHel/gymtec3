"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Ticket, User, Client } from "@prisma/client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Combinamos los tipos para tener acceso a los datos relacionados
type TicketWithRelations = Ticket & {
  client: Client
  assignedTo: User | null
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
    OPEN: "secondary",
    IN_PROGRESS: "default",
    CLOSED: "destructive",
}

export const columns: ColumnDef<TicketWithRelations>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
  },
  {
    accessorKey: "client.name",
    header: "Cliente",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={statusVariantMap[status] || "default"}>{status}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Prioridad",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString()}</div>
    }
  },
  {
    accessorKey: "assignedTo.name",
    header: "Técnico Asignado",
    cell: ({ row }) => {
        return row.original.assignedTo?.name || <span className="text-muted-foreground">No asignado</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original

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
            <DropdownMenuItem>Editar Ticket</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Eliminar Ticket</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 