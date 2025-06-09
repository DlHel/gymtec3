"use client"

import { useFormState } from "react-dom"
import { updateTicket, type State } from "../actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ticket, Client, User, TicketStatus, TicketPriority } from "@prisma/client"

interface EditTicketFormProps {
    ticket: Ticket
    clients: Client[]
    users: User[]
}

export function EditTicketForm({ ticket, clients, users }: EditTicketFormProps) {
    const initialState: State = { message: null, errors: {} };
    const updateTicketWithId = updateTicket.bind(null, ticket.id)
    const [state, formAction] = useFormState(updateTicketWithId, initialState);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Editar Ticket</CardTitle>
                    <CardDescription>Modifique los detalles del ticket y guarde los cambios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input id="title" name="title" defaultValue={ticket.title} required />
                        {state.errors?.title && <p className="text-sm text-red-500">{state.errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" name="description" defaultValue={ticket.description ?? ''} required />
                        {state.errors?.description && <p className="text-sm text-red-500">{state.errors.description}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientId">Cliente</Label>
                        <Select name="clientId" defaultValue={ticket.clientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.clientId && <p className="text-sm text-red-500">{state.errors.clientId}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado</Label>
                            <Select name="status" defaultValue={ticket.status}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TicketStatus).map(status => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridad</Label>
                            <Select name="priority" defaultValue={ticket.priority}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione una prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TicketPriority).map(priority => (
                                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assignedToId">Asignar a Técnico</Label>
                        <Select name="assignedToId" defaultValue={ticket.assignedToId ?? ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sin asignar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Sin asignar</SelectItem>
                                {users.map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/tickets/${ticket.id}`}>
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">Guardar Cambios</Button>
                </CardFooter>
            </Card>
            {state.message && <p className="text-sm text-red-500 mt-4">{state.message}</p>}
        </form>
    )
} 