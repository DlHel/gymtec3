"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Equipment, Location, Client } from "@prisma/client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type EquipmentWithLocationAndClient = Equipment & { 
    location: Location & { 
        client: Client 
    } 
}

export const columns: ColumnDef<EquipmentWithLocationAndClient>[] = [
    {
        accessorKey: "brand",
        header: "Marca",
    },
    {
        accessorKey: "model",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Modelo <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "location.client.name",
        header: "Cliente",
    },
    {
        accessorKey: "location.name",
        header: "Ubicación",
    },
    {
        accessorKey: "serialNumber",
        header: "Número de Serie",
        cell: ({ row }) => {
            const serialNumber = row.getValue("serialNumber") as string
            return serialNumber || <span className="text-muted-foreground">N/A</span>
        }
    },
    {
        accessorKey: "installationDate",
        header: "Instalación",
        cell: ({ row }) => {
            const date = row.getValue("installationDate") as Date
            return date ? new Date(date).toLocaleDateString('es-CL') : <span className="text-muted-foreground">N/A</span>
        }
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
                        <DropdownMenuItem>Crear Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Ver Historial</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 