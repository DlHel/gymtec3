"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Ticket, User, Client, Contract, SLA } from "@prisma/client"
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
import { format } from 'date-fns'
import { SlaIndicator } from "@/components/sla-indicator"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

// Combinamos los tipos para tener acceso a los datos relacionados
export type TicketWithRelations = Ticket & {
  client: Client
  assignedTo: User | null
  equipment: { model: string } | null
  contract: (Contract & { sla: SLA | null }) | null;
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    OPEN: "secondary",
    IN_PROGRESS: "default",
    CLOSED: "destructive",
    PENDING_APPROVAL: "outline",
}

export const columns: ColumnDef<TicketWithRelations>[] = [
  {
    id: 'sla',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA" />
    ),
    cell: ({ row }) => {
      return <SlaIndicator ticket={row.original} />
    }
  },
  {
    accessorKey: "ticketNumber",
    header: "N° Ticket",
  },
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
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <Link
          href={`/dashboard/tickets/${ticket.id}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {ticket.title}
        </Link>
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
        return <div>{format(date, 'dd/MM/yyyy')}</div>
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
            <DropdownMenuLabel>Acciones Rápidas</DropdownMenuLabel>
            <DropdownMenuItem>Asignar Técnico</DropdownMenuItem>
            <DropdownMenuItem>Cambiar Prioridad</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Eliminar Ticket</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 