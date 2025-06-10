import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { getParts } from './actions'
import { columns, PartColumn } from './components/columns'
import { PartsDataTable } from './components/PartsDataTable'

export default async function PartsPage() {
  const data: PartColumn[] = await getParts()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Repuestos (${data.length})`}
          description="Administra el inventario de repuestos de Gymtec"
        />
        <Link href="/dashboard/inventory/parts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Repuesto
          </Button>
        </Link>
      </div>
      <Separator />
      <PartsDataTable columns={columns} data={data} />
    </div>
  )
} 