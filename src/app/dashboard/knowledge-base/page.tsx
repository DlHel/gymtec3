import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function KnowledgeBasePage() {
  const knowledgeEntries = await prisma.knowledgeBaseEntry.findMany({
    include: {
      _count: {
        select: { checklists: true },
      },
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Base de Conocimiento</h1>
          <p className="text-gray-600">
            Repositorio central de checklists, manuales y notas técnicas por modelo de equipo.
          </p>
        </div>
        <Button>Añadir Entrada</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeEntries.map((entry) => (
          <Link key={entry.id} href={`/dashboard/knowledge-base/${entry.id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{entry.modelName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{entry.description ?? "Sin descripción."}</p>
                <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium">{entry._count.checklists} Checklist(s) disponible(s)</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
         {knowledgeEntries.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
                No hay entradas en la base de conocimiento.
            </p>
        )}
      </div>
    </div>
  )
} 