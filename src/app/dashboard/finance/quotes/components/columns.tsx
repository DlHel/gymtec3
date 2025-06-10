"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Quote } from "@prisma/client"
import { format } from "date-fns"

export type QuoteWithDetails = Quote & {
    client: { name: string }
    ticket: { title: string } | null
}

const statuses: { [key: string]: string } = {
    PENDING: "Pendiente",
    APPROVED: "Aprobada",
    REJECTED: "Rechazada",
    INVOICED: "Facturada",
}

const statusColors: { [key: string]: string } = {
    PENDING: "bg-yellow-500",
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
    INVOICED: "bg-blue-500",
}

export const columns: ColumnDef<QuoteWithDetails>[] = [
    {
        accessorKey: "id",
        header: "Cotización ID",
        cell: ({ row }) => {
            const id = row.getValue("id") as string
            return <div className="font-medium">...{id.slice(-6)}</div>
        },
    },
    {
        accessorKey: "client",
        header: "Cliente",
        cell: ({ row }) => row.original.client.name,
    },
    {
        accessorKey: "ticket",
        header: "Ticket Asociado",
        cell: ({ row }) =>
            row.original.ticket ? row.original.ticket.title : "N/A",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    className={`text-white ${statusColors[status] || "bg-gray-500"}`}
                >
                    {statuses[status] || status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "total",
        header: "Monto Total",
        cell: ({ row }) => {
            const total = parseFloat(row.getValue("total"))
            return new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
            }).format(total)
        },
    },
    {
        accessorKey: "issueDate",
        header: "Fecha de Emisión",
        cell: ({ row }) => {
            const date = row.getValue("issueDate") as string
            return <span>{format(new Date(date), "dd/MM/yyyy")}</span>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const quote = row.original

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
                            <Link href={`/dashboard/finance/quotes/edit/${quote.id}`}>
                                Ver / Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(quote.id)}
                        >
                            Copiar ID de la Cotización
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 