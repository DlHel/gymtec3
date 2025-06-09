import { prisma } from "@/lib/prisma"
import EquipmentDataTable from "./components/EquipmentDataTable"

export default async function EquipmentMasterPage() {
    const equipment = await prisma.equipment.findMany({
        include: {
            location: {
                include: {
                    client: true
                }
            }
        }
    })

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Maestro de Equipos</h1>
            <p className="text-muted-foreground mb-6">
                Esta tabla muestra todos los equipos registrados en el sistema, a través de todos los clientes.
            </p>
            <EquipmentDataTable equipment={equipment} />
        </div>
    )
} 