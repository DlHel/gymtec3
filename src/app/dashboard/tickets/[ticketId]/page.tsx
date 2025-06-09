import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import TicketDetails from "../components/TicketDetails"

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
            }
        }
    });

    const availableParts = await prisma.part.findMany({
        where: { stock: { gt: 0 } }
    });

    if (!ticket) {
        notFound();
    }

    return <TicketDetails ticket={ticket} availableParts={availableParts} />;
} 