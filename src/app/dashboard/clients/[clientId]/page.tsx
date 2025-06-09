import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, FileText, Wrench, Info } from "lucide-react"
import ClientHeader from "./components/ClientHeader"
import LocationsTab from "./components/LocationsTab"
import ContractsTab from "./components/ContractsTab"
import TicketsTab from "./components/TicketsTab"
import EquipmentTab from "./components/EquipmentTab"

interface ClientDetailPageProps {
  params: {
    clientId: string
  }
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const client = await prisma.client.findUnique({
    where: { id: params.clientId },
    include: {
      locations: {
        include: {
          equipment: true,
        },
      },
      contracts: true,
      tickets: true,
    },
  })

  if (!client) {
    notFound()
  }

  const allEquipment = client.locations.flatMap(location => 
    location.equipment.map(eq => ({...eq, locationName: location.name}))
  );

  return (
    <div className="container mx-auto py-10">
      <ClientHeader client={client} />

      <Tabs defaultValue="locations" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="locations">
            <Building className="mr-2 h-4 w-4" />
            Sedes y Contactos
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <FileText className="mr-2 h-4 w-4" />
            Contratos y SLAs
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Wrench className="mr-2 h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Info className="mr-2 h-4 w-4" />
            Inventario de Equipos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="locations">
          <LocationsTab locations={client.locations} />
        </TabsContent>
        <TabsContent value="contracts">
          <ContractsTab contracts={client.contracts} />
        </TabsContent>
        <TabsContent value="tickets">
          <TicketsTab tickets={client.tickets} />
        </TabsContent>
        <TabsContent value="equipment">
          <EquipmentTab equipment={allEquipment} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 