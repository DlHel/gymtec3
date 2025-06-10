import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

import { SlaForm } from "../../components/sla-form"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

interface EditSlaPageProps {
  params: {
    slaId: string
  }
}

export default async function EditSlaPage({ params }: EditSlaPageProps) {
  const sla = await prisma.sLA.findUnique({
    where: {
      id: params.slaId,
    },
  })

  if (!sla) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Editar SLA"
        description="Modifica la plantilla de Acuerdo de Nivel de Servicio."
      />
      <Separator />
      <SlaForm sla={sla} />
    </div>
  )
} 