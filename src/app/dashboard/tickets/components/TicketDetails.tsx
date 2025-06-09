"use client"
import { Ticket, Client, User, Equipment } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketPageActions } from "./TicketPageActions"
import { TicketChecklist } from "./TicketChecklist"

type TicketWithRelations = Ticket & {
    client: Client
    assignedTo: User | null
    createdBy: User | null
    equipment: Equipment | null
}

interface TicketDetailsProps {
    ticket: TicketWithRelations
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-yellow-100 text-yellow-800'
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
            case 'RESOLVED': return 'bg-green-100 text-green-800'
            case 'CLOSED': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'LOW': return 'bg-green-100 text-green-800'
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
            case 'HIGH': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">{ticket.title}</h1>
                    <p className="text-muted-foreground">Ticket #{ticket.id}</p>
                </div>
                <TicketPageActions ticketId={ticket.id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Ticket</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="font-medium">Estado:</span>
                            <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Prioridad:</span>
                            <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Cliente:</span>
                            <span>{ticket.client.name}</span>
                        </div>
                        {ticket.assignedTo && (
                            <div className="flex justify-between">
                                <span className="font-medium">Asignado a:</span>
                                <span>{ticket.assignedTo.name}</span>
                            </div>
                        )}
                        {ticket.equipment && (
                            <div className="flex justify-between">
                                <span className="font-medium">Equipo:</span>
                                <span>{ticket.equipment.name} - {ticket.equipment.model}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="font-medium">Creado por:</span>
                            <span>{ticket.createdBy?.name || 'Desconocido'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Fecha de creación:</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Descripción</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{ticket.description}</p>
                    </CardContent>
                </Card>
            </div>

            <TicketChecklist ticketId={ticket.id} />
        </div>
    )
} 