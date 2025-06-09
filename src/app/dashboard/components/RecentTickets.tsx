"use client"

import { Ticket, Client } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type TicketWithClient = Ticket & { client: Client };

interface RecentTicketsProps {
    tickets: TicketWithClient[];
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    OPEN: "default",
    IN_PROGRESS: "secondary",
    CLOSED: "outline",
    CANCELED: "destructive",
};

export default function RecentTickets({ tickets }: RecentTicketsProps) {
    if (tickets.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-muted-foreground">No hay tickets recientes.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell>
                                    <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium text-blue-600 hover:underline">
                                        {ticket.title}
                                    </Link>
                                    <p className="text-sm text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </TableCell>
                                <TableCell>{ticket.client.name}</TableCell>
                                <TableCell>
                                    <Badge variant={statusVariantMap[ticket.status] ?? 'default'}>
                                        {ticket.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
} 