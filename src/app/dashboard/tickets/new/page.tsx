import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { TicketForm } from '../components/ticket-form'
import { getTicketCreationData } from './actions'

export default async function NewTicketPage() {
  const { clients, technicians } = await getTicketCreationData()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Crear Nuevo Ticket"
          description="Registra un nuevo incidente o solicitud de servicio"
        />
        <Separator />
        <TicketForm clients={clients} technicians={technicians} />
      </div>
    </div>
  )
} 