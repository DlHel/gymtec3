"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Equipment, Location, Client } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type FullEquipment = Equipment & {
    location: Location & {
        client: Client
    }
}

export const columns: ColumnDef<FullEquipment>[] = [
  {
    accessorKey: "model",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Modelo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "serialNumber",
    header: "Número de Serie",
  },
  {
    accessorKey: "location.client.name",
    header: "Cliente",
    cell: ({ row }) => {
        const { location } = row.original
        return (
            <Link href={`/dashboard/clients/${location.client.id}`} className="hover:underline text-blue-600 font-medium">
                {location.client.name}
            </Link>
        )
    }
  },
  {
    accessorKey: "location.name",
    header: "Sede",
  },
] 