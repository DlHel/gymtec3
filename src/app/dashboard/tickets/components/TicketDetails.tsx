"use client"
import { Ticket, Client, User, Equipment, Part, PartUsage, TimeEntry, Comment } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketPageActions } from "./TicketPageActions"
import { TicketChecklist } from "./TicketChecklist"
import PartsUsageForm from "./PartsUsageForm"
import TimeEntryForm from "./TimeEntryForm"
import CommentForm from "./CommentForm"

type TicketWithRelations = Ticket & {
    client: Client
    assignedTo: User | null
    createdBy: User | null
    equipment: Equipment | null
    partsUsed: (PartUsage & { part: Part })[]
    timeEntries: TimeEntry[]
    comments: (Comment & { user: User })[]
}

interface TicketDetailsProps {
    ticket: TicketWithRelations
    availableParts: Part[]
}

export default function TicketDetails({ ticket, availableParts }: TicketDetailsProps) {
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Detalles del Ticket #{ticket.id.substring(0, 8)}</h1>
                    <TicketPageActions ticket={ticket} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Descripción</CardTitle>
                                <CardDescription>
                                    <p className="text-sm text-gray-500">{ticket.description}</p>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description ?? ''}</p>
                            </CardContent>
                        </Card>
                        <TicketChecklist ticket={ticket} />
                        <Card>
                            <CardHeader>
                                <CardTitle>Uso de Repuestos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PartsUsageForm ticketId={ticket.id} availableParts={availableParts} />
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-2">Repuestos Registrados:</h4>
                                    <ul className="list-disc pl-5">
                                        {ticket.partsUsed.map(usage => (
                                            <li key={usage.id}>
                                                {usage.quantity} x {usage.part.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registro de Horas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TimeEntryForm ticketId={ticket.id} />
                                <div className="mt-6">
                                    <h4 className="font-semibold mb-2">Horas Registradas:</h4>
                                    <ul className="list-disc pl-5">
                                        {ticket.timeEntries.map(entry => (
                                            <li key={entry.id}>
                                                {entry.hours} horas - {entry.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Comentarios</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CommentForm ticketId={ticket.id} />
                                <div className="mt-6 space-y-4">
                                    {ticket.comments.map(comment => (
                                        <div key={comment.id} className="text-sm">
                                            <p className="font-semibold">{comment.user.name}</p>
                                            <p className="text-gray-600">{comment.content}</p>
                                            <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
} 