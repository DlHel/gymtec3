"use client"
import { Ticket, Client, User, Equipment, Part, PartUsage, TimeEntry, Comment, Photo } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TicketChecklist } from "./TicketChecklist"
import PartsUsageForm from "./PartsUsageForm"
import TimeEntryForm from "./TimeEntryForm"
import CommentForm from "./CommentForm"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Badge } from "@/components/ui/badge"
import PhotoUploader from "./PhotoUploader"

const statusTranslations: { [key: string]: string } = {
    OPEN: "Abierto",
    IN_PROGRESS: "En Progreso",
    CLOSED: "Cerrado",
    PENDING_APPROVAL: "Pendiente Aprobación"
};

const priorityTranslations: { [key: string]: string } = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta"
};

type TicketWithRelations = Ticket & {
    client: Client
    assignedTo: User | null
    createdBy: User | null
    equipment: Equipment | null
    partsUsed: (PartUsage & { part: Part })[]
    timeEntries: TimeEntry[]
    comments: (Comment & { user: User })[]
    photos: Photo[]
}

interface TicketDetailsProps {
    ticket: TicketWithRelations
    availableParts: Part[]
}

export default function TicketDetails({ ticket, availableParts }: TicketDetailsProps) {
    const formatDate = (date: Date | string) => {
        return format(new Date(date), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'destructive'
            case 'MEDIUM': return 'secondary'
            default: return 'outline'
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'OPEN': return 'default'
            case 'IN_PROGRESS': return 'secondary'
            case 'CLOSED': return 'outline'
            default: return 'default'
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Descripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description ?? 'No hay descripción.'}</p>
                        </CardContent>
                    </Card>

                    {ticket.equipment && (
                        <TicketChecklist 
                            ticketId={ticket.id} 
                            modelName={ticket.equipment.model} 
                            initialChecklistStateJSON={ticket.checklistState} 
                        />
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Documentación Fotográfica</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {ticket.photos.map(photo => (
                                    <div key={photo.id}>
                                        <img src={photo.url} alt={photo.description || 'Foto del ticket'} className="rounded-md object-cover aspect-square" />
                                        <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>
                                    </div>
                                ))}
                                {ticket.photos.length === 0 && <p className="text-sm text-gray-500 col-span-full">No se han añadido fotos.</p>}
                            </div>
                            <PhotoUploader ticketId={ticket.id} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Uso de Repuestos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PartsUsageForm ticketId={ticket.id} availableParts={availableParts} />
                            <div className="mt-6">
                                <h4 className="font-semibold mb-2">Repuestos Registrados:</h4>
                                {ticket.partsUsed.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {ticket.partsUsed.map(usage => (
                                            <li key={usage.id}>
                                                {usage.quantity} x {usage.part.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-500">No se han registrado repuestos.</p>}
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
                                {ticket.comments.length > 0 ? (
                                    ticket.comments.map(comment => (
                                        <div key={comment.id} className="text-sm bg-gray-50 p-3 rounded-md">
                                            <p className="font-semibold">{comment.user.name}</p>
                                            <p className="text-gray-600 my-1">{comment.content}</p>
                                            <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
                                        </div>
                                    ))
                                ) : <p className="text-sm text-gray-500">No hay comentarios.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna lateral */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Ticket</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Estado:</span>
                                <Badge variant={getStatusBadgeVariant(ticket.status)}>{statusTranslations[ticket.status] ?? ticket.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Prioridad:</span>
                                <Badge variant={getPriorityBadgeVariant(ticket.priority)}>{priorityTranslations[ticket.priority] ?? ticket.priority}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Cliente:</span>
                                <Link href={`/dashboard/clients/${ticket.clientId}`} className="text-blue-600 hover:underline">
                                    {ticket.client.name}
                                </Link>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Creado por:</span>
                                <span>{ticket.createdBy?.name ?? 'N/A'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="font-semibold">Asignado a:</span>
                                <span>{ticket.assignedTo?.name ?? 'Sin asignar'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="font-semibold">Fecha Creación:</span>
                                <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Registro de Horas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TimeEntryForm ticketId={ticket.id} />
                            <div className="mt-6">
                                <h4 className="font-semibold mb-2">Horas Registradas:</h4>
                                {ticket.timeEntries.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {ticket.timeEntries.map(entry => (
                                            <li key={entry.id}>
                                                {entry.hours} horas - {entry.description}
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-500">No se han registrado horas.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 