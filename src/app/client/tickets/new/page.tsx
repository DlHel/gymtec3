import { Heading } from "@/components/ui/heading"
import { getClientEquipment } from "../../dashboard/actions"
import { NewTicketForm } from "./components/NewTicketForm"

export default async function NewClientTicketPage() {
  const equipment = await getClientEquipment()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Crear un Ticket"
        description="Complete el siguiente formulario para solicitar un nuevo servicio."
      />
      <NewTicketForm equipment={equipment} />
    </div>
  )
} 