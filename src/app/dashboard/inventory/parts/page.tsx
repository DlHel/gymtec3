import { prisma } from "@/lib/prisma"
import { columns } from "./components/columns"
import { DataTable } from "@/components/modules/DataTable"

export default async function PartsPage() {
  const parts = await prisma.part.findMany()

  return (
    <>
      <p className="text-gray-600 mb-8">
        Gestiona el stock, costos y detalles de los repuestos.
      </p>
      <DataTable columns={columns} data={parts} searchKey="name" />
    </>
  )
} 