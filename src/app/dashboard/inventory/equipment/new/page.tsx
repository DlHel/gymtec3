import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { EquipmentForm } from '../components/equipment-form'
import { getClientsAndLocations } from './actions'

export default async function NewEquipmentPage() {
  const clients = await getClientsAndLocations()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Nuevo Equipo"
            description="Añade un nuevo equipo al inventario de un cliente"
          />
        </div>
        <Separator />
        <EquipmentForm clients={clients} />
      </div>
    </div>
  )
} 