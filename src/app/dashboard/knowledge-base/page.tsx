import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { getKnowledgeBaseEntries } from './actions'
import { columns } from './components/columns'
import { KnowledgeBaseTable } from './components/knowledge-base-table'

export default async function KnowledgeBasePage() {
  const data = await getKnowledgeBaseEntries()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Base de Conocimiento (${data.length})`}
          description="Administra los checklists y procedimientos por modelo de equipo"
        />
        <Link href="/dashboard/knowledge-base/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Ficha de Modelo
          </Button>
        </Link>
      </div>
      <Separator />
      <KnowledgeBaseTable columns={columns} data={data} />
    </div>
  )
} 