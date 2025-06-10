'use client'

import { Ticket } from '@prisma/client'
import { columns } from './columns'
import { TicketsTable } from './tickets-table'

interface TicketsTabProps {
  tickets: Ticket[]
}

export function TicketsTab({ tickets }: TicketsTabProps) {
  return (
    <div>
      <TicketsTable columns={columns} data={tickets} />
    </div>
  )
} 