"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Client, Ticket } from "@prisma/client"
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

export type Quote = {
    id: string;
    quoteNumber: string;
    status: string;
    issueDate: Date;
    total: number;
    client: Client;
    ticket: Ticket | null;
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    DRAFT: "secondary",
    SENT: "default",
    ACCEPTED: "default",
    REJECTED: "destructive",
};

export const columns: ColumnDef<Quote>[] = [
    {
        accessorKey: "quoteNumber",
        header: "Nº Cotización",
    },
    {
        accessorKey: "client.name",
        header: "Cliente",
    },
    {
        accessorKey: "ticket.title",
        header: "Ticket Asociado",
        cell: ({ row }) => {
            const ticket = row.original.ticket;
            return ticket ? <Link href={`/dashboard/tickets/${ticket.id}`} className="underline">{ticket.title}</Link> : "N/A";
        }
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const variant = statusVariantMap[status] || "default";
            return <Badge variant={variant}>{status}</Badge>
        }
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total"))
            const formatted = new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        }
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
                            <Link href={`/dashboard/finance/quotes/edit/${quote.id}`}>Ver / Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 