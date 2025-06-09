import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditTicketForm } from "@/app/dashboard/tickets/components/EditTicketForm";

export default async function EditTicketPage({ params }: { params: { ticketId: string } }) {
    const { ticketId } = params;

    const [ticket, clients, users] = await Promise.all([
        prisma.ticket.findUnique({
            where: { id: ticketId },
        }),
        prisma.client.findMany(),
        prisma.user.findMany(), // Asumiendo que todos los usuarios pueden ser técnicos
    ]);

    if (!ticket) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl">
                <EditTicketForm ticket={ticket} clients={clients} users={users} />
            </div>
        </div>
    );
} 