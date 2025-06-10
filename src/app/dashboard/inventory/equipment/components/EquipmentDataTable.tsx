"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns, EquipmentWithLocationAndClient } from "./columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface EquipmentDataTableProps {
    data: EquipmentWithLocationAndClient[]
}

export function EquipmentDataTable({ data }: EquipmentDataTableProps) {

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
            data={data} 
            searchKey="model"
            newButton={newEquipmentButton}
            onRowClick={(row) => `/dashboard/inventory/equipment/${row.id}`}
        />
    )
} 