import { Ticket } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface TicketsTabProps {
  tickets: Ticket[]
}

const statusColors = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  CLOSED: "bg-green-100 text-green-800",
  WAITING_PARTS: "bg-orange-100 text-orange-800",
  WAITING_CLIENT: "bg-purple-100 text-purple-800",
}

const priorityColors = {
    LOW: "bg-gray-200 text-gray-800",
    MEDIUM: "bg-blue-200 text-blue-800",
    HIGH: "bg-yellow-200 text-yellow-800",
    URGENT: "bg-red-200 text-red-800",
}

export default function TicketsTab({ tickets }: TicketsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        {tickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha de Creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", statusColors[ticket.status as keyof typeof statusColors])}>
                        {ticket.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", priorityColors[ticket.priority as keyof typeof priorityColors])}>
                        {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No hay tickets registrados para este cliente.</p>
        )}
      </CardContent>
    </Card>
  )
} 