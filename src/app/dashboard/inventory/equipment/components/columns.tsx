"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Equipment, Location, Client } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CellActions } from "./CellActions"

type EquipmentWithLocationAndClient = Equipment & { 
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
        cell: ({ row }) => {
            const equipment = row.original;
            return (
                <Link href={`/dashboard/inventory/equipment/${equipment.id}`} className="hover:underline">
                    {equipment.model}
                </Link>
            )
        }
    },
    {
        accessorKey: "location.client.name",
        header: "Cliente",
        cell: ({ row }) => {
            const equipment = row.original
            return (
                <Link 
                    href={`/dashboard/clients/${equipment.location.client.id}`} 
                    className="hover:underline"
                >
                    {equipment.location.client.name}
                </Link>
            )
        }
    },
    {
        accessorKey: "location.name",
        header: "Ubicación",
        cell: ({ row }) => {
            const equipment = row.original
            return equipment.location.name
        }
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
        cell: ({ row }) => <CellActions equipment={row.original} />,
    },
] 