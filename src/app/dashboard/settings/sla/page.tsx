import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { columns } from "./components/columns"
import { SlaTable } from "./components/sla-table"

export default async function SlaPage() {
  const slas = await prisma.sLA.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`SLAs (${slas.length})`}
          description="Gestiona las plantillas de Acuerdos de Nivel de Servicio."
        />
        <Link href="/dashboard/settings/sla/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo SLA
          </Button>
        </Link>
      </div>
      <Separator />
      <SlaTable columns={columns} data={slas} />
    </div>
  )
} 