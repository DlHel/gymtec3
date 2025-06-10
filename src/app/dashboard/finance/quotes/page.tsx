import { prisma } from '@/lib/prisma'
import { columns } from './components/columns'
import { QuotesTable } from './components/quotes-table'

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({
    include: {
      client: {
        select: {
          name: true,
        },
      },
      ticket: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      issueDate: 'desc',
    },
  })

  // This casting is necessary because the `total` is a Decimal type in Prisma
  const formattedQuotes = quotes.map(q => ({ ...q, total: q.total.toNumber() }))


  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cotizaciones</h2>
          <p className="text-muted-foreground">
            Gestiona las cotizaciones para clientes y servicios.
          </p>
        </div>
      </div>
      <QuotesTable columns={columns} data={formattedQuotes} />
    </div>
  )
}
