import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditClientForm } from "../EditClientForm";

export default async function EditClientPage({ params }: { params: { clientId: string } }) {
    const { clientId } = params;
    const client = await prisma.client.findUnique({
        where: {
            id: clientId,
        },
    });

    if (!client) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl">
                <EditClientForm client={client} />
            </div>
        </div>
    );
} 