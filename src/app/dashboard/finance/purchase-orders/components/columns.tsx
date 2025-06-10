"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
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
import { PurchaseOrder, Supplier } from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Definimos un tipo extendido para incluir el proveedor y los items
export type PurchaseOrderWithDetails = PurchaseOrder & {
    supplier: { name: string } | null
    items: { quantity: number; cost: number | null }[]
}

export type PurchaseOrderWithSupplier = PurchaseOrder & {
    supplier: Supplier
}

const statuses: { [key: string]: string } = {
    PENDING: "Pendiente",
    ORDERED: "Ordenada",
    SHIPPED: "Enviada",
    RECEIVED: "Recibida",
    CANCELLED: "Cancelada",
}

const statusColors: { [key: string]: string } = {
    PENDING: "bg-yellow-500",
    ORDERED: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    RECEIVED: "bg-green-500",
    CANCELLED: "bg-red-500",
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
    DRAFT: 'outline',
    ORDERED: 'secondary',
    RECEIVED: 'default',
    CANCELLED: 'destructive',
}

export const columns: ColumnDef<PurchaseOrderWithSupplier>[] = [
    {
        accessorKey: "orderNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    N° Orden
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "supplier.name",
        header: "Proveedor",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={statusVariantMap[status] || 'default'}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "totalAmount",
        header: "Total",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmount"))
            const formatted = new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
            }).format(amount)
            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "orderDate",
        header: "Fecha de Orden",
        cell: ({ row }) => {
            return format(new Date(row.original.orderDate), "dd/MM/yyyy", { locale: es })
        },
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
                            <Link href={`/dashboard/finance/purchase-orders/edit/${order.id}`}>
                                Ver / Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(order.id)}
                        >
                            Copiar ID de la Orden
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 