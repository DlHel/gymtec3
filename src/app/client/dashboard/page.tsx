import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { getClientTickets } from "./actions";
import { ClientTicketList } from "./components/ClientTicketList";
import Link from "next/link";

export default async function ClientDashboardPage() {
    const tickets = await getClientTickets();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title="Mis Tickets de Servicio"
                    description="Aquí puede ver y gestionar sus solicitudes de servicio técnico."
                />
                <Link href="/client/tickets/new">
                    <Button>
                        + Crear Nuevo Ticket
                    </Button>
                </Link>
            </div>
            <ClientTicketList data={tickets} />
        </div>
    );
} 