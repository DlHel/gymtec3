"use client"
import { Ticket, Client, User, Equipment } from "@prisma/client"
import { TicketInfoCard } from "./TicketInfoCard"
import { TicketPageActions } from "./TicketPageActions"
import { TicketChecklist } from "./TicketChecklist"

type TicketWithRelations = Ticket & {
    client: Client
    assignedTo: User | null
    createdBy: User
    equipment: Equipment | null
}

interface TicketDetailsProps {
    ticket: TicketWithRelations
}

export default function TicketDetails({ ticket }: TicketDetailsProps) {
    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{ticket.title}</h1>
                    <p className="text-muted-foreground">Ticket #{ticket.id.substring(0, 8)}</p>
                </div>
                <TicketPageActions ticket={ticket} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 bg-white rounded-lg shadow-md border">
                        <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description ?? ''}</p>
                    </div>
                    
                    {ticket.equipment && (
                        <TicketChecklist 
                            modelName={ticket.equipment.model} 
                            ticketId={ticket.id}
                            initialChecklistStateJSON={ticket.checklistState}
                        />
                    )}

                </div>
                <div className="lg:col-span-1">
                    <TicketInfoCard ticket={ticket} />
                </div>
            </div>
        </div>
    )
} 