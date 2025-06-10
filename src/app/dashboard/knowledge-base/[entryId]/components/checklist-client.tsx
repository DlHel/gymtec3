'use client'

import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checklist, KnowledgeBaseEntry } from '@prisma/client'
import { Plus } from 'lucide-react'
import { CreateChecklistDialog } from './create-checklist-dialog'
import { TaskBuilder } from './task-builder'

interface ChecklistClientProps {
  entry: KnowledgeBaseEntry & {
    checklists: Checklist[]
  }
}

export function ChecklistClient({ entry }: ChecklistClientProps) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <CreateChecklistDialog knowledgeBaseId={entry.id}>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Checklist
          </Button>
        </CreateChecklistDialog>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {entry.checklists.map((checklist) => (
          <AccordionItem key={checklist.id} value={checklist.id}>
            <AccordionTrigger>{checklist.name}</AccordionTrigger>
            <AccordionContent>
              <TaskBuilder checklist={checklist} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {entry.checklists.length === 0 && (
        <div className="text-center text-muted-foreground mt-8 border-2 border-dashed rounded-lg p-8">
          <p>No hay checklists para este modelo.</p>
          <p className="text-sm">
            Empieza por crear el primero (ej. "Mantenimiento Preventivo
            Mensual").
          </p>
        </div>
      )}
    </div>
  )
} 