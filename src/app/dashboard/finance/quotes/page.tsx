import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/modules/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "./components/columns";
import { QuotesDataTable } from "./components/data-table";

async function getQuotes() {
    const quotes = await prisma.quote.findMany({
        include: {
            client: true,
            ticket: true,
        },
        orderBy: {
            issueDate: 'desc'
        }
    });
    return quotes;
}

export default async function QuotesPage() {
    const quotes = await getQuotes();

    return (
        <div>
            <PageHeader title="Cotizaciones">
                <Button asChild>
                    <Link href="/dashboard/finance/quotes/new">Crear Cotización</Link>
                </Button>
            </PageHeader>
            <QuotesDataTable columns={columns} data={quotes} />
        </div>
    )
} 
