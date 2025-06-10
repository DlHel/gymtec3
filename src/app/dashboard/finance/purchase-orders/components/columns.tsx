"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Supplier } from "@prisma/client"
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

export type PurchaseOrder = {
    id: string;
    poNumber: string;
    status: string;
    issueDate: Date;
    total: number;
    supplier: Supplier;
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    DRAFT: "secondary",
    ORDERED: "default",
    PARTIALLY_RECEIVED: "outline",
    RECEIVED: "default",
    CANCELED: "destructive"
};


export const columns: ColumnDef<PurchaseOrder>[] = [
    {
        accessorKey: "poNumber",
        header: "Nº Orden",
    },
    {
        accessorKey: "supplier.name",
        header: "Proveedor",
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
        accessorKey: "issueDate",
        header: "Fecha de Emisión",
        cell: ({ row }) => {
            const date = new Date(row.getValue("issueDate"))
            return date.toLocaleDateString()
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
            const order = row.original

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
                            <Link href={`/dashboard/finance/purchase-orders/edit/${order.id}`}>Ver / Editar</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 