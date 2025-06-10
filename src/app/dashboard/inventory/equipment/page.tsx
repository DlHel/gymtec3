import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { getEquipment } from './actions'
import { columns } from './components/columns'
import { EquipmentTable } from './components/equipment-table'

export default async function EquipmentPage() {
  const data = await getEquipment()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Equipos (${data.length})`}
          description="Administra todos los equipos de los clientes"
        />
        <Link href="/dashboard/inventory/equipment/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Equipo
          </Button>
        </Link>
      </div>
      <Separator />
      <EquipmentTable columns={columns} data={data} />
    </div>
  )
} 