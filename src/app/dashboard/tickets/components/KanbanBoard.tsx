'use client'

import { TicketWithRelations } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { SlaIndicator } from "@/components/sla-indicator"
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { KanbanColumn } from './KanbanColumn'

const TicketCard = ({ ticket }: { ticket: TicketWithRelations }) => (
    <Card className="mb-2 hover:shadow-md transition-shadow">
        <CardContent className="p-3">
            <div className="flex justify-between items-start">
                <SlaIndicator ticket={ticket} />
                <Badge variant="outline">{ticket.priority}</Badge>
            </div>
            <Link href={`/dashboard/tickets/${ticket.id}`}>
                <h4 className="font-semibold mt-2 hover:underline">{ticket.title}</h4>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">{ticket.client.name}</p>
            <p className="text-xs text-muted-foreground mt-2">
                Técnico: {ticket.assignedTo?.name || 'No asignado'}
            </p>
        </CardContent>
    </Card>
);

const kanbanColumns = [
    { id: 'OPEN', title: 'Abiertos' },
    { id: 'IN_PROGRESS', title: 'En Progreso' },
    { id: 'PENDING_APPROVAL', title: 'Pendiente Aprobación' },
    { id: 'CLOSED', title: 'Cerrados' }
]

export function KanbanBoard({ data }: { data: TicketWithRelations[] }) {
    const ticketsByStatus = kanbanColumns.map(col => ({
        ...col,
        tickets: data.filter(ticket => ticket.status === col.id)
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ticketsByStatus.map(column => (
                <div key={column.id}>
                    <Card className="bg-gray-50/50">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                {column.title}
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    ({column.tickets.length})
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[60vh] overflow-y-auto p-2">
                            {column.tickets.map(ticket => (
                                <TicketCard key={ticket.id} ticket={ticket} />
                            ))}
                            {column.tickets.length === 0 && (
                                <div className="text-center text-sm text-muted-foreground p-4">
                                    No hay tickets en este estado.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
} 