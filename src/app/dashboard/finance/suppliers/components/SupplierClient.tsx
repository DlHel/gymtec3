'use client'

import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/modules/DataTable'

import { Supplier } from '@prisma/client'
import { columns } from './columns'

interface SupplierClientProps {
  data: Supplier[]
}

export const SupplierClient: React.FC<SupplierClientProps> = ({ data }) => {
  const router = useRouter()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Proveedores (${data.length})`}
          description="Gestiona los proveedores de repuestos y servicios."
        />
        <Button onClick={() => router.push(`/dashboard/finance/suppliers/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Nuevo
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  )
} 