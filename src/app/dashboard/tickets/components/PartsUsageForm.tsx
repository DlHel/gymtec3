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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trash2, PlusCircle } from "lucide-react"
import { addPartsToTicket } from "@/app/dashboard/tickets/actions"
import { toast } from "sonner"
import { Part } from "@prisma/client"
import { useRouter } from "next/navigation"

const partUsageSchema = z.object({
  partId: z.string().min(1, "Debes seleccionar un repuesto"),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1"),
})

const formSchema = z.object({
  parts: z.array(partUsageSchema),
})

interface PartsUsageFormProps {
  ticketId: string
  availableParts: Part[]
}

export default function PartsUsageForm({ ticketId, availableParts }: PartsUsageFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parts: [{ partId: "", quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parts",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addPartsToTicket(ticketId, values.parts)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Repuestos agregados exitosamente.")
      form.reset({ parts: [{ partId: "", quantity: 1 }] })
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-lg font-medium">Añadir Repuestos Utilizados</h3>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name={`parts.${index}.partId`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Repuesto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar repuesto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableParts.map((part) => (
                          <SelectItem key={part.id} value={part.id}>
                            {part.name} ({part.stock} disponibles)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`parts.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
        <div className="flex justify-between items-center">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ partId: "", quantity: 1 })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Otro Repuesto
            </Button>
            <Button type="submit">Guardar Repuestos</Button>
        </div>
      </form>
    </Form>
  )
} 