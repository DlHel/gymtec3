"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SLA } from "@prisma/client"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const columns: ColumnDef<SLA>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "responseTimeHours",
    header: "T. Respuesta (h)",
  },
  {
    accessorKey: "resolutionTimeHours",
    header: "T. Resolución (h)",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sla = row.original

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
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/settings/sla/edit/${sla.id}`}>Editar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Copiar ID</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 