import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { getTickets } from './actions'
import { columns } from './components/columns'
import { TicketTable } from './components/ticket-table'

export default async function TicketsPage() {
  const data = await getTickets()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Tickets (${data.length})`}
          description="Visualiza y gestiona todos los tickets de servicio"
        />
        <Link href="/dashboard/tickets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Ticket
          </Button>
        </Link>
      </div>
      <Separator />
      <TicketTable columns={columns} data={data} />
    </div>
  )
} 