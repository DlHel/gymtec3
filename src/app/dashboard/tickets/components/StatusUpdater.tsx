'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { updateTicketStatus } from '../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const statusOptions = [
  { value: 'OPEN', label: 'Abierto' },
  { value: 'IN_PROGRESS', label: 'En Progreso' },
  { value: 'PENDING_APPROVAL', label: 'Finalizar y Notificar al Cliente' },
]

export function StatusUpdater({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    const result = await updateTicketStatus(ticketId, newStatus)

    if (result.error) {
      toast.error(result.error)
    } else {
      if (newStatus === 'PENDING_APPROVAL') {
        toast.success('Trabajo finalizado. Se ha notificado al cliente para su aprobación.')
      } else {
        toast.success('Estado del ticket actualizado.')
      }
      router.refresh()
    }
  }

  const isClosed = currentStatus === 'CLOSED' || currentStatus === 'PENDING_APPROVAL';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isClosed}>
          {isClosed ? 'Pendiente de Cierre' : 'Cambiar Estado'}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statusOptions.map((status) => (
          <DropdownMenuItem
            key={status.value}
            disabled={status.value === currentStatus}
            onSelect={() => handleStatusChange(status.value)}
          >
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 