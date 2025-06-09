import { prisma } from "@/lib/prisma"
import ClientsDataTable from "./components/ClientsDataTable"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
      <p className="text-gray-600 mb-8">
        Aquí puedes ver, buscar y gestionar todos los clientes de Gymtec.
      </p>
      <ClientsDataTable clients={clients} />
    </div>
  )
} 