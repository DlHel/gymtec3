import { prisma } from '@/lib/prisma'
import { QuoteForm } from '../components/quote-form'
import { Heading } from '@/components/ui/heading'

export default async function NewQuotePage() {
  const clients = await prisma.client.findMany()
  const tickets = await prisma.ticket.findMany({
    include: {
      client: {
        select: {
          id: true,
        },
      },
    },
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Crear Cotización"
        description="Complete el formulario para generar una nueva cotización."
      />
      <QuoteForm clients={clients} tickets={tickets} />
    </div>
  )
}
