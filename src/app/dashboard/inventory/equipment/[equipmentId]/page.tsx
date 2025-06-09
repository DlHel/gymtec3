import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import MaintenanceHistory from "./components/MaintenanceHistory";

export default async function EquipmentDetailsPage({ params }: { params: { equipmentId: string } }) {
    const equipment = await prisma.equipment.findUnique({
        where: { id: params.equipmentId },
        include: {
            location: {
                include: {
                    client: true,
                },
            },
            tickets: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        },
    });

    if (!equipment) {
        notFound();
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{equipment.model}</h1>
                    <p className="text-muted-foreground">{equipment.brand}</p>
                </div>
                <Link href={`/dashboard/inventory/equipment/edit/${equipment.id}`}>
                    <Button>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Mantenimiento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MaintenanceHistory tickets={equipment.tickets} />
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="font-semibold">Cliente</h4>
                                <p>{equipment.location?.client.name ?? 'No asignado'}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold">Ubicación</h4>
                                <p>{equipment.location?.name ?? 'No asignado'}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Número de Serie</h4>
                                <p>{equipment.serialNumber}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Fecha de Instalación</h4>
                                <p>{equipment.installationDate ? new Date(equipment.installationDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 