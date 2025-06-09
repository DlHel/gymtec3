import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EquipmentForm } from "../../components/EquipmentForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/modules/DataTable";
import { columns as ticketColumns } from "@/app/dashboard/tickets/components/columns";

export default async function EditEquipmentPage({ params }: { params: { equipmentId: string } }) {
    const { equipmentId } = params;

    const [equipment, clients] = await Promise.all([
        prisma.equipment.findUnique({
            where: { id: equipmentId },
            include: {
                tickets: true,
            }
        }),
        prisma.client.findMany({
            include: {
                locations: true
            }
        })
    ]);

    if (!equipment) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <EquipmentForm equipment={equipment} clients={clients} />
            
            <Card>
                <CardHeader>
                    <CardTitle>Historial de Mantenimiento</CardTitle>
                    <CardDescription>
                        Todos los tickets de servicio asociados a este equipo.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={ticketColumns} data={equipment.tickets} />
                </CardContent>
            </Card>
        </div>
    );
} 