'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Ticket, User } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export type ClientTicket = Ticket & {
  assignedTo: User | null
}

const statusTranslations: { [key: string]: string } = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Progreso',
  PENDING_APPROVAL: 'Pendiente Aprobación',
  CLOSED: 'Cerrado',
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'outline' } = {
  OPEN: 'secondary',
  IN_PROGRESS: 'default',
  PENDING_APPROVAL: 'default',
  CLOSED: 'outline',
}

export const columns: ColumnDef<ClientTicket>[] = [
  {
    accessorKey: 'ticketNumber',
    header: 'N° Ticket',
    cell: ({ row }) => `#${row.original.id.slice(-6)}`,
  },
  {
    accessorKey: 'title',
    header: 'Asunto',
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={statusVariantMap[status] || 'default'}>
          {statusTranslations[status] || status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de Creación',
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), 'dd/MM/yyyy', { locale: es })
    },
  },
  {
      accessorKey: 'assignedTo.name',
      header: 'Técnico Asignado',
      cell: ({ row }) => row.original.assignedTo?.name || 'Por asignar',
  },
] 