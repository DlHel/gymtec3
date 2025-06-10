import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import TicketDetails from "../components/TicketDetails"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DeleteTicketButton } from "../components/TicketPageActions"
import { Separator } from "@/components/ui/separator"
import { StatusUpdater } from "../components/StatusUpdater"

export default async function TicketDetailsPage({ params }: { params: { ticketId: string } }) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: params.ticketId },
        include: { 
            client: true,
            assignedTo: true,
            createdBy: true,
            equipment: true,
            partsUsed: {
                include: {
                    part: true
                }
            },
            timeEntries: true,
            comments: {
                include: {
                    user: true
                }
            },
            photos: true
        }
    });

    const availableParts = await prisma.part.findMany({
        where: { stock: { gt: 0 } }
    });

    if (!ticket) {
        notFound();
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                 <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{ticket.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            Ticket #{ticket.ticketNumber || ticket.id.slice(-6)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <StatusUpdater ticketId={ticket.id} currentStatus={ticket.status} />
                        <Link href={`/dashboard/tickets/edit/${ticket.id}`}>
                            <Button>Editar</Button>
                        </Link>
                        <DeleteTicketButton ticketId={ticket.id} />
                    </div>
                </div>
                <Separator />
                <TicketDetails ticket={ticket} availableParts={availableParts} />
            </div>
        </div>
    );
} 