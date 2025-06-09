import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ChecklistCard from "./components/ChecklistCard"
import CreateChecklistDialog from "./components/CreateChecklistDialog"

interface KnowledgeBaseDetailPageProps {
    params: {
        entryId: string
    }
}

export default async function KnowledgeBaseDetailPage({ params }: KnowledgeBaseDetailPageProps) {
    const entry = await prisma.knowledgeBaseEntry.findUnique({
        where: { id: params.entryId },
        include: {
            checklists: {
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })

    if (!entry) {
        notFound()
    }
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">{entry.modelName}</h1>
                        <p className="text-muted-foreground">{entry.manufacturer}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Checklists</h2>
                        <CreateChecklistDialog knowledgeBaseId={entry.id} />
                    </div>

                    <div className="space-y-4">
                        {entry.checklists.map((checklist) => (
                            <ChecklistCard 
                                key={checklist.id} 
                                checklist={checklist} 
                                knowledgeBaseId={entry.id} 
                            />
                        ))}
                        {entry.checklists.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                <p className="text-gray-500">No hay checklists para este modelo de equipo.</p>
                                <p className="text-sm text-gray-400 mt-2">Puedes empezar creando uno.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 