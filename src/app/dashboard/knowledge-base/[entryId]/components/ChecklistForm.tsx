"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Trash2, PlusCircle } from "lucide-react"
import { createChecklist, updateChecklist } from "./actions"
import { toast } from "sonner"
import { Checklist } from "@prisma/client"

const taskSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "La tarea no puede estar vacía"),
})

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  tasks: z.array(taskSchema),
})

interface ChecklistFormProps {
  knowledgeBaseId: string
  setOpen: (open: boolean) => void
  checklist?: Checklist
}

export default function ChecklistForm({ knowledgeBaseId, setOpen, checklist }: ChecklistFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: checklist?.name ?? "",
      tasks: checklist ? JSON.parse(checklist.tasks) : [{ text: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let result;
    if (checklist) {
        result = await updateChecklist(checklist.id, knowledgeBaseId, values)
    } else {
        const dataToSave = { ...values, knowledgeBaseId }
        result = await createChecklist(dataToSave)
    }
    
    if (result.errors) {
      toast.error(result.message)
    } else {
      toast.success(result.message)
      setOpen(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Checklist</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mantenimiento Preventivo Trimestral" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <h3 className="text-lg font-medium mb-2">Tareas</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`tasks.${index}.text`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder={`Tarea ${index + 1}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => append({ text: "" })}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Tarea
          </Button>
        </div>

        <Button type="submit" className="w-full">
            {checklist ? "Guardar Cambios" : "Crear Checklist"}
        </Button>
      </form>
    </Form>
  )
} 