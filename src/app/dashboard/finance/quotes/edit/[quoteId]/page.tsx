import { prisma } from '@/lib/prisma'
import { QuoteForm } from '../../components/quote-form'
import { Heading } from '@/components/ui/heading'
import { notFound } from 'next/navigation'

interface EditQuotePageProps {
  params: {
    quoteId: string
  }
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const quote = await prisma.quote.findUnique({
    where: {
      id: params.quoteId,
    },
    include: {
      items: {
        select: {
          description: true,
          quantity: true,
          unitPrice: true,
        }
      },
    },
  })

  if (!quote) {
    notFound()
  }

  // Prisma's Decimal needs to be converted to number for the form
  const formattedQuote = {
    ...quote,
    items: quote.items.map(item => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
    })),
  }

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
        title="Editar Cotización"
        description="Modifique los detalles de la cotización."
      />
      <QuoteForm
        quote={formattedQuote}
        clients={clients}
        tickets={tickets}
      />
    </div>
  )
} 