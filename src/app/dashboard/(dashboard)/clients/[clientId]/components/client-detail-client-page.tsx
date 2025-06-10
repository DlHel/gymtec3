'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Client, Contract, Equipment, Location, Ticket } from '@prisma/client'
import { Heading } from '@/components/ui/heading'
import { LocationsTab } from './LocationsTab'
import { EquipmentTab } from './EquipmentTab'
import { LocationSelector } from './location-selector'
import { useState } from 'react'
import { TicketsTab } from './TicketsTab'

type ClientWithDetails = Client & {
  locations: Location[]
  equipment: (Equipment & { location: Location })[]
  tickets: Ticket[]
  contracts: Contract[]
}

interface ClientDetailClientPageProps {
  client: ClientWithDetails
}

export function ClientDetailClientPage({ client }: ClientDetailClientPageProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>(
    client.locations[0]
  )

  const filteredEquipment =
    selectedLocation
      ? client.equipment.filter((e: Equipment & { location: Location }) => e.locationId === selectedLocation.id)
      : client.equipment

  // Assuming tickets have a direct locationId or can be inferred via equipment
  // This might need adjustment based on your data model
  const filteredTickets = selectedLocation
    ? client.tickets.filter(
        (t: Ticket) =>
          client.equipment.find((e: Equipment & { location: Location }) => e.id === t.equipmentId)?.locationId ===
          selectedLocation.id
      )
    : client.tickets

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-4 md:flex md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <Heading title={client.name} description={`RUT: ${client.rut} - Detalles y gestión del cliente.`} />
        <LocationSelector
          locations={client.locations}
          selectedLocation={selectedLocation}
          onSelect={setSelectedLocation}
        />
      </div>
      <Tabs defaultValue="equipment" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="equipment">Equipos ({filteredEquipment.length})</TabsTrigger>
          <TabsTrigger value="locations">Sedes ({client.locations.length})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({filteredTickets.length})</TabsTrigger>
          <TabsTrigger value="contracts">Contratos ({client.contracts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="equipment">
          <EquipmentTab data={filteredEquipment} clientId={client.id} />
        </TabsContent>
        <TabsContent value="locations">
          <LocationsTab locations={client.locations} clientId={client.id} />
        </TabsContent>
        <TabsContent value="tickets">
            <TicketsTab data={filteredTickets} />
        </TabsContent>
        <TabsContent value="contracts">
          {/* Contracts tab content goes here */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 