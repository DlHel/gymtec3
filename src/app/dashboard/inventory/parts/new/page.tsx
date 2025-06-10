import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { PartForm } from '../components/part-form'
import { getSuppliers } from './actions'

export default async function NewPartPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Nuevo Repuesto"
            description="Añade un nuevo repuesto al inventario"
          />
        </div>
        <Separator />
        <PartForm suppliers={suppliers} />
      </div>
    </div>
  )
} 