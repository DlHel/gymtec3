import { prisma } from "@/lib/prisma"
import TicketForm from "../components/TicketForm"

export default async function NewTicketPage() {
    
    const clients = await prisma.client.findMany();
    const users = await prisma.user.findMany({
        where: { role: 'TECHNICIAN' }
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Crear Nuevo Ticket</h1>
                <p className="text-muted-foreground mt-2">
                    Rellena los detalles para abrir un nuevo ticket de servicio.
                </p>
            </div>
            <TicketForm clients={clients} users={users} />
        </div>
    )
} 