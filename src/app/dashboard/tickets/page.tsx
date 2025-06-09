import { prisma } from "@/lib/prisma"
import TicketsDataTable from "./components/TicketsDataTable"

export default async function TicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: {
        client: true,
        assignedTo: true,
    }
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Tickets</h1>
          <p className="text-gray-600 mt-2">
            Aquí puedes ver, buscar y gestionar todos los tickets de servicio.
          </p>
        </div>
      </div>
      <TicketsDataTable tickets={tickets} />
    </div>
  )
} 