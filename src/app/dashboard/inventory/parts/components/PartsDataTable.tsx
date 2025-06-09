"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns } from "./columns"
import { Part } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface PartsDataTableProps {
    parts: Part[]
}

export default function PartsDataTable({ parts }: PartsDataTableProps) {

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
            data={parts} 
            searchKey="name"
            newButton={newPartButton}
        />
    )
} 