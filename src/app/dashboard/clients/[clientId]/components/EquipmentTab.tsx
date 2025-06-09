import { Equipment } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// El tipo extendido que creamos en la página
type EquipmentWithLocation = Equipment & { locationName: string }

interface EquipmentTabProps {
  equipment: EquipmentWithLocation[]
}

export default function EquipmentTab({ equipment }: EquipmentTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventario de Equipos del Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        {equipment.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>N/S</TableHead>
                <TableHead>Sede</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.model}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>{item.locationName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No hay equipos registrados para este cliente.</p>
        )}
      </CardContent>
    </Card>
  )
} 