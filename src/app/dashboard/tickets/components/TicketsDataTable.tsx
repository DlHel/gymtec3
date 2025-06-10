"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns, TicketWithRelations } from "./columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface TicketsDataTableProps {
    data: TicketWithRelations[]
}

export function TicketsDataTable({ data }: TicketsDataTableProps) {

    const newTicketButton = (
        <Link href="/dashboard/tickets/new">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Ticket
            </Button>
        </Link>
      )

    return (
        <DataTable 
            columns={columns} 
            data={data} 
            searchKey="title"
            newButton={newTicketButton}
            onRowClick={(row) => `/dashboard/tickets/${row.id}`}
        />
    )
} 