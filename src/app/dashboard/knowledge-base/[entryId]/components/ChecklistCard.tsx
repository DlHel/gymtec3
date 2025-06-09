"use client"

import { Checklist } from "@prisma/client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ListChecks } from "lucide-react"
import { deleteChecklist } from "../actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react"
import ChecklistForm from "./ChecklistForm"
import CreateChecklistDialog from "./CreateChecklistDialog"
import { DeleteChecklistDialog } from "./DeleteChecklistDialog"

interface ChecklistCardProps {
  checklist: Checklist
  knowledgeBaseId: string
}

type Task = {
  id: string
  text: string
}

export default function ChecklistCard({ checklist, knowledgeBaseId }: ChecklistCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const tasks: Task[] = JSON.parse(checklist.tasks)

  async function handleDelete() {
    const result = await deleteChecklist(checklist.id, checklist.knowledgeBaseId)
    if (result.message.includes("Error")) {
        toast.error(result.message)
    } else {
        toast.success(result.message)
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full bg-white rounded-lg shadow-md">
      <AccordionItem value={checklist.id} className="border-none">
        <div className="flex items-center justify-between p-4">
          <AccordionTrigger className="flex-1 text-lg font-semibold hover:no-underline">
            {checklist.name}
          </AccordionTrigger>
          <div className="flex items-center gap-2 ml-4">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="w-5 h-5 text-blue-600" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Editar Checklist</DialogTitle>
                </DialogHeader>
                <ChecklistForm
                  knowledgeBaseId={knowledgeBaseId}
                  setOpen={setIsEditDialogOpen}
                  checklist={checklist}
                />
              </DialogContent>
            </Dialog>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el checklist.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

          </div>
        </div>
        <AccordionContent className="p-4 pt-0">
          <ul className="space-y-2 list-disc list-inside bg-gray-50 p-4 rounded-md">
            {tasks.map((task, index) => (
              <li key={index} className="text-gray-700">{task.text}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 