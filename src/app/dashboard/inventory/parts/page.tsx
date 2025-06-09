import { prisma } from "@/lib/prisma"
import PartsDataTable from "./components/PartsDataTable"

export default async function SparePartsPage() {
    const parts = await prisma.part.findMany()

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Inventario de Repuestos</h1>
            <p className="text-muted-foreground mb-6">
                Visualiza y gestiona el stock de todos los repuestos.
            </p>
            <PartsDataTable parts={parts} />
        </div>
    )
} 