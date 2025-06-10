"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns, PartColumn } from "./columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

interface PartsDataTableProps {
    data: PartColumn[]
    columns: ColumnDef<PartColumn>[]
}

export function PartsDataTable({ data, columns }: PartsDataTableProps) {

    const newPartButton = (
        <Link href="/dashboard/inventory/parts/new">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Repuesto
            </Button>
        </Link>
    )

    return (
        <DataTable 
            columns={columns} 
            data={data} 
            searchKey="name"
            newButton={newPartButton}
            onRowClick={(row) => `/dashboard/inventory/parts/edit/${row.id}`}
        />
    )
} 