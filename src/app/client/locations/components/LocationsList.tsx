'use client'

import { Location, Equipment } from "@prisma/client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type LocationWithEquipment = Location & {
  equipment: Equipment[]
}

interface LocationsListProps {
  locations: LocationWithEquipment[]
}

export function LocationsList({ locations }: LocationsListProps) {
    const router = useRouter();

    const handleRequestServiceClick = (equipmentId: string) => {
        router.push(`/client/tickets/new?equipmentId=${equipmentId}`);
    }

  if (locations.length === 0) {
    return <p>No se encontraron ubicaciones para su cuenta.</p>
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {locations.map((location) => (
        <AccordionItem value={location.id} key={location.id}>
          <AccordionTrigger>
            <div className="flex flex-col text-left">
                <span className="text-lg font-semibold">{location.name}</span>
                <span className="text-sm text-muted-foreground">{location.address}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {location.equipment.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>N° de Serie</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {location.equipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.model}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.serialNumber || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleRequestServiceClick(item.id)}>
                            Solicitar Servicio
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">No hay equipos registrados en esta ubicación.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
} 