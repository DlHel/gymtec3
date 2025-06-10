import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/modules/PageHeader";
import { QuoteForm } from "../components/QuoteForm";

async function getFormData() {
    const clients = await prisma.client.findMany();
    const tickets = await prisma.ticket.findMany({
        where: {
            status: { not: "CLOSED" }
        }
    });
    return { clients, tickets };
}

export default async function NewQuotePage() {
    const { clients, tickets } = await getFormData();

    return (
        <div>
            <PageHeader title="Crear Cotización" />
            <div className="p-8">
                <QuoteForm clients={clients} tickets={tickets} />
            </div>
        </div>
    )
}
