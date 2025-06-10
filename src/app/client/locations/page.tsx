import { Heading } from "@/components/ui/heading"
import { getClientLocationsWithEquipment } from "../dashboard/actions"
import { LocationsList } from "./components/LocationsList"

export default async function LocationsPage() {
  const locations = await getClientLocationsWithEquipment()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Mis Ubicaciones y Equipos"
        description="Revise las ubicaciones y el inventario de equipos registrados en su cuenta."
      />
      <LocationsList locations={locations} />
    </div>
  )
} 