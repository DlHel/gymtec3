"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns } from "./columns"
import { Equipment, Location, Client } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import {
  Table,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

type EquipmentWithLocationAndClient = Equipment & {
    location: Location & {
        client: Client
    }
}

interface EquipmentDataTableProps {
    equipment: EquipmentWithLocationAndClient[]
}

export default function EquipmentDataTable({ equipment }: EquipmentDataTableProps) {

    const newEquipmentButton = (
        <Link href="/dashboard/inventory/equipment/new">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Equipo
            </Button>
        </Link>
    )

    return (
        <DataTable 
            columns={columns} 
            data={equipment} 
            searchKey="model"
            newButton={newEquipmentButton}
            onRowClick={(row) => `/dashboard/clients/${row.location.client.id}`}
        />
    )
} 