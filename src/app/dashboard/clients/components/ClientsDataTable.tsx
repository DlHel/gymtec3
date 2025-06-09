"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns } from "./columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Client } from "@prisma/client"

interface ClientsDataTableProps {
    clients: Client[]
}

export default function ClientsDataTable({ clients }: ClientsDataTableProps) {
    
    const newClientButton = (
        <Link href="/dashboard/clients/new">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Cliente
            </Button>
        </Link>
    )

    return (
        <DataTable 
            columns={columns} 
            data={clients} 
            searchKey="name"
            newButton={newClientButton}
            onRowClick={(row) => `/dashboard/clients/${row.id}`}
        />
    )
} 