import { prisma } from "@/lib/prisma"
import { columns } from "./components/columns"
import { DataTable } from "@/components/modules/DataTable"

export default async function EquipmentPage() {
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
    <>
      <p className="text-gray-600 mb-8">
        Visualiza el inventario maestro de todos los equipos instalados en clientes.
      </p>
      <DataTable columns={columns} data={equipment} searchKey="model" />
    </>
  )
} 