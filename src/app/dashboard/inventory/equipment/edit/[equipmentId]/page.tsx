import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EquipmentForm } from "../../components/EquipmentForm";

export default async function EditEquipmentPage({ params }: { params: { equipmentId: string } }) {
    const { equipmentId } = params;

    const [equipment, clients] = await Promise.all([
        prisma.equipment.findUnique({ where: { id: equipmentId } }),
        prisma.client.findMany(),
    ]);

    if (!equipment) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl">
                <EquipmentForm equipment={equipment} clients={clients} />
            </div>
        </div>
    );
} 