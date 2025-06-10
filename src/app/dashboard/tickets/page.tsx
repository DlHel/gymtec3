'use client'

import { useState, useEffect } from 'react'
import { Plus, LayoutGrid, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { getTickets } from './actions'
import { columns, TicketWithRelations } from './components/columns'
import { TicketTable } from './components/ticket-table'
import { KanbanBoard } from './components/KanbanBoard'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function TicketsPage() {
  const [data, setData] = useState<TicketWithRelations[]>([])
  const [view, setView] = useState('list') // 'list' or 'kanban'

  useEffect(() => {
    getTickets().then(tickets => setData(tickets))
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Tickets (${data.length})`}
          description="Visualiza y gestiona todos los tickets de servicio"
        />
        <div className="flex items-center space-x-2">
            <ToggleGroup type="single" value={view} onValueChange={(value) => { if(value) setView(value) }}>
              <ToggleGroupItem value="list" aria-label="Vista de lista">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="kanban" aria-label="Vista kanban">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Link href="/dashboard/tickets/new">
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Ticket
                </Button>
            </Link>
        </div>
      </div>
      <Separator />
      {view === 'list' ? (
        <TicketTable columns={columns} data={data} />
      ) : (
        <KanbanBoard data={data} />
      )}
    </div>
  )
} 