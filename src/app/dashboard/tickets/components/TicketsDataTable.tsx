"use client"

import { DataTable } from "@/components/modules/DataTable"
import { columns } from "./columns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Ticket, User, Client } from "@prisma/client"

type TicketWithRelations = Ticket & {
    client: Client
    assignedTo: User | null
}

interface TicketsDataTableProps {
    tickets: TicketWithRelations[]
}

export default function TicketsDataTable({ tickets }: TicketsDataTableProps) {

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
            data={tickets} 
            searchKey="title"
            newButton={newTicketButton}
            onRowClick={(row) => `/dashboard/tickets/${row.id}`}
        />
    )
} 