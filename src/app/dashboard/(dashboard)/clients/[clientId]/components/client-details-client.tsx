'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Client, Contract, Equipment, Location, Ticket } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { ClientModal } from './client-modal'
import { ContractsTab } from './ContractsTab'
import { EquipmentTab } from './EquipmentTab'
import { LocationsTab } from './LocationsTab'
import { TicketsTab } from './TicketsTab'

interface ClientDetailsClientProps {
  client: Client & {
    locations: Location[]
    contracts: Contract[]
    tickets: Ticket[]
  }
  equipment: (Equipment & { location: { name: string } })[]
  userRole: string
}

export function ClientDetailsClient({
  client,
  equipment,
  userRole,
}: ClientDetailsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} client={client} />
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <Heading
              title={client.name}
              description={`RUT: ${client.rut} - Administra los detalles del cliente.`}
            />
            <Button onClick={() => setIsModalOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar Cliente
            </Button>
          </div>
          <Separator />
          <Tabs defaultValue="locations" className="space-y-4">
            <TabsList>
              <TabsTrigger value="locations">Sedes y Contactos</TabsTrigger>
              <TabsTrigger value="equipment">Inventario de Equipos</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              {userRole === 'ADMIN' && (
                <TabsTrigger value="contracts">Contratos y SLAs</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="locations" className="space-y-4">
              <LocationsTab locations={client.locations} clientId={client.id} />
            </TabsContent>
            <TabsContent value="equipment" className="space-y-4">
              <EquipmentTab data={equipment} clientId={client.id} />
            </TabsContent>
            <TabsContent value="tickets" className="space-y-4">
              <TicketsTab data={client.tickets} />
            </TabsContent>
            {userRole === 'ADMIN' && (
              <TabsContent value="contracts" className="space-y-4">
                <ContractsTab contracts={client.contracts} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  )
} 