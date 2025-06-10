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
import { createChecklist, updateChecklist } from "../actions"
import { toast } from "sonner"
import { Checklist } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const taskSchema = z.object({
  text: z.string().min(3, "La tarea debe tener al menos 3 caracteres."),
})

const formSchema = z.object({
  name: z.string().min(5, "El nombre del checklist debe tener al menos 5 caracteres."),
  tasks: z.array(taskSchema).min(1, "El checklist debe tener al menos una tarea."),
})

interface ChecklistFormProps {
  knowledgeBaseEntryId: string
  checklist?: Checklist | null
  onFinished?: () => void
}

export function ChecklistForm({ knowledgeBaseEntryId, checklist, onFinished }: ChecklistFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: checklist?.name || "",
      tasks: checklist?.tasks ? JSON.parse(checklist.tasks) : [{ text: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let result;
    const payload = {
      name: values.name,
      tasks: values.tasks,
    };

    if (checklist && checklist.id) {
      result = await updateChecklist(checklist.id, knowledgeBaseEntryId, payload);
    } else {
      result = await createChecklist({ ...payload, knowledgeBaseEntryId });
    }

    if (result.errors) {
      // Podrías iterar sobre result.errors para mostrar mensajes más específicos si es necesario
      const errorMessages = Object.values(result.errors).flat().join("; ");
      toast.error(`Error de validación: ${errorMessages || result.message}`);
    } else if (result.message.startsWith("Error de base de datos")) {
      toast.error(result.message);
    } else {
      toast.success(result.message); // El mensaje de éxito ya viene formateado desde la acción
      if (onFinished) onFinished();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{checklist ? "Editar" : "Crear"} Checklist</CardTitle>
        <CardDescription>
          {checklist
            ? `Editando la plantilla "${checklist.name}".`
            : "Crea una nueva plantilla de checklist para este modelo."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormLabel>Tareas del Checklist</FormLabel>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder={`Tarea #${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Tarea
              </Button>
              <Button type="submit">
                {checklist ? "Guardar Cambios" : "Crear Checklist"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 