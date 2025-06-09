import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/modules/StatCard";
import { Users, Ticket, Wrench, HardHat } from "lucide-react";

export default async function DashboardPage() {

    // Obtener partes con bajo stock usando una consulta SQL cruda
    const lowStockPartsResult = await prisma.$queryRaw<[{count: bigint}]>`
        SELECT COUNT(*) as count FROM "Part" WHERE stock <= minStock
    `;
    const lowStockParts = Number(lowStockPartsResult[0].count);

    const [totalClients, openTickets, totalEquipment] = await Promise.all([
        prisma.client.count(),
        prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
        prisma.equipment.count(),
    ]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Dashboard General</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total de Clientes"
                    value={totalClients}
                    icon={Users}
                    description="Clientes activos en el sistema"
                />
                <StatCard
                    title="Tickets Abiertos"
                    value={openTickets}
                    icon={Ticket}
                    description="Tickets que requieren atención"
                />
                <StatCard
                    title="Repuestos con Bajo Stock"
                    value={lowStockParts}
                    icon={Wrench}
                    description="Items que necesitan ser reabastecidos"
                />
                <StatCard
                    title="Total de Equipos"
                    value={totalEquipment}
                    icon={HardHat}
                    description="Equipos registrados en clientes"
                />
            </div>

            <div className="mt-8">
                {/* Aquí podríamos añadir gráficos o tablas de actividad reciente en el futuro */}
                <h2 className="text-2xl font-semibold mb-4">Actividad Reciente</h2>
                <div className="p-6 bg-white rounded-lg shadow-md border text-center text-muted-foreground">
                    Próximamente: Gráficos y registros de actividad.
                </div>
            </div>
        </div>
    );
} 