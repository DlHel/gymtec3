import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { getKnowledgeBaseEntry } from './actions'
import { ChecklistClient } from './components/checklist-client'

interface KnowledgeBaseEntryPageProps {
  params: {
    entryId: string
  }
}

export default async function KnowledgeBaseEntryPage({
  params,
}: KnowledgeBaseEntryPageProps) {
  const entry = await getKnowledgeBaseEntry(params.entryId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`Checklists para ${entry.modelName}`}
          description={entry.description || 'Gestiona los checklists para este modelo.'}
        />
        <Separator />
        <ChecklistClient entry={entry} />
      </div>
    </div>
  )
} 