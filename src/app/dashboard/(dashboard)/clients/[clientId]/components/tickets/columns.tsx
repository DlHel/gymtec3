'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Ticket } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const statuses: { [key: string]: string } = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Progreso',
  CLOSED: 'Cerrado',
  ON_HOLD: 'En Espera',
}

const priorities: { [key: string]: string } = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
}

const statusColors: { [key: string]: string } = {
  OPEN: 'bg-blue-500',
  IN_PROGRESS: 'bg-yellow-500',
  CLOSED: 'bg-green-500',
  ON_HOLD: 'bg-gray-500',
}

const priorityColors: { [key: string]: string } = {
    LOW: 'bg-green-200 text-green-800',
    MEDIUM: 'bg-yellow-200 text-yellow-800',
    HIGH: 'bg-red-200 text-red-800',
}


export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const ticket = row.original
        return (
            <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium underline">
                {ticket.title}
            </Link>
        )
    }
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          className={`text-white ${statusColors[status] || 'bg-gray-500'}`}
        >
          {statuses[status] || status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: 'Prioridad',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string
      return (
        <Badge
          className={`${priorityColors[priority] || 'bg-gray-200'}`}
        >
          {priorities[priority] || priority}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de Creación',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string
      return <span>{format(new Date(date), 'dd/MM/yyyy')}</span>
    },
  },
] 