"use client"

import { Ticket } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface MaintenanceHistoryProps {
    tickets: Ticket[];
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    OPEN: "default",
    IN_PROGRESS: "secondary",
    CLOSED: "outline",
    CANCELED: "destructive",
};

export default function MaintenanceHistory({ tickets }: MaintenanceHistoryProps) {
    if (tickets.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay historial de mantenimiento para este equipo.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                        <TableCell>
                            <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium text-blue-600 hover:underline">
                                {ticket.title}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant={statusVariantMap[ticket.status] ?? 'default'}>
                                {ticket.status}
                            </Badge>
                        </TableCell>
                         <TableCell>
                             <Badge variant={ticket.priority === 'HIGH' ? 'destructive' : 'default'}>
                                {ticket.priority}
                            </Badge>
                        </TableCell>
                        <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
} 