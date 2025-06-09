import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { HardHat } from "lucide-react"

export default async function KnowledgeBasePage() {
  // Obtener todas las entradas de knowledge base
  const knowledgeBaseEntries = await prisma.knowledgeBaseEntry.findMany({
    include: {
      _count: {
        select: {
          checklists: true
        }
      }
    },
    orderBy: {
      modelName: 'asc'
    }
  })

  // Si no hay entradas, buscar modelos de equipment para mostrar información
  const equipmentModels = knowledgeBaseEntries.length === 0 ? await prisma.equipment.groupBy({
    by: ['model'],
    _count: {
      model: true,
    },
  }) : []

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Base de Conocimiento</h1>
      <p className="text-muted-foreground mb-8">
        Seleccione un modelo de equipo para ver o editar sus checklists de mantenimiento y reparación.
      </p>

      {knowledgeBaseEntries.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12">
          <HardHat className="mx-auto h-12 w-12" />
          <p className="mt-4">No se han encontrado entradas en la base de conocimiento.</p>
          <p>Cree entradas desde el sistema de tickets para que aparezcan aquí.</p>
          {equipmentModels.length > 0 && (
            <p className="mt-2">Hay {equipmentModels.length} modelo(s) de equipo que podrían tener entradas.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBaseEntries.map((entry) => (
            <Link href={`/dashboard/knowledge-base/${entry.id}`} key={entry.id}>
              <Card className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardHat /> {entry.modelName}
                  </CardTitle>
                  <CardDescription>{entry.manufacturer || "Sin fabricante"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{entry._count.checklists} checklist(s) disponibles.</p>
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 