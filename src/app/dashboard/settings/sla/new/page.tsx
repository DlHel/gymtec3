import { SlaForm } from "../components/sla-form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export default function NewSlaPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Crear SLA"
        description="Define una nueva plantilla de Acuerdo de Nivel de Servicio."
      />
      <Separator />
      <SlaForm />
    </div>
  )
} 