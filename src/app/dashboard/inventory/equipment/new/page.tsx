import { prisma } from "@/lib/prisma";
import { EquipmentForm } from "../components/EquipmentForm";

export default async function NewEquipmentPage() {
    const clients = await prisma.client.findMany({
        include: {
            locations: true
        }
    });

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-4xl">
                <EquipmentForm clients={clients} />
            </div>
        </div>
    );
} 