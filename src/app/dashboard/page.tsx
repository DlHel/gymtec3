import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/modules/StatCard";
import { Users, Ticket, Wrench, HardHat } from "lucide-react";
import RecentTickets from "@/app/dashboard/components/RecentTickets";
import LowStockParts from "@/app/dashboard/components/LowStockParts";

export default async function DashboardPage() {

    const [totalClients, openTickets, totalEquipment, lowStockParts, recentTickets] = await Promise.all([
        prisma.client.count(),
        prisma.ticket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
        prisma.equipment.count(),
        prisma.part.findMany({
            where: {
                stock: {
                    lte: prisma.part.fields.minStock
                }
            },
            orderBy: {
                stock: 'asc'
            }
        }),
        prisma.ticket.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                client: true,
            }
        })
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
                    value={lowStockParts.length}
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

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Tickets Recientes</h2>
                    <RecentTickets tickets={recentTickets} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Repuestos por Agotarse</h2>
                    <LowStockParts parts={lowStockParts} />
                </div>
            </div>
        </div>
    );
} 