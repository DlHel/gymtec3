import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { getClients } from './actions'
import { ClientTable } from './components/client-table'
import { columns } from './components/columns'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Clientes (${clients.length})`}
          description="Administra los clientes de Gymtec"
        />
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
          </Button>
        </Link>
      </div>
      <Separator />
      <ClientTable columns={columns} data={clients} />
    </div>
  )
} 