"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import ChecklistForm from "./ChecklistForm"

interface CreateChecklistDialogProps {
    knowledgeBaseId: string
}

export default function CreateChecklistDialog({ knowledgeBaseId }: CreateChecklistDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Checklist
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Checklist</DialogTitle>
                </DialogHeader>
                <ChecklistForm 
                    knowledgeBaseId={knowledgeBaseId} 
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    )
} 