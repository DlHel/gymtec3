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
        }
    });

    if (!ticket) {
        notFound();
    }

    return <TicketDetails ticket={ticket} />;
} 