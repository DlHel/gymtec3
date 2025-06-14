"use client"

import { useForm } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { addTimeEntry } from "@/app/dashboard/tickets/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  hours: z.coerce.number().min(0.1, "Debe registrar al menos 0.1 horas."),
  description: z.string().optional(),
})

interface TimeEntryFormProps {
  ticketId: string
}

export default function TimeEntryForm({ ticketId }: TimeEntryFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: 0.5,
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addTimeEntry(ticketId, values)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Horas registradas exitosamente.")
      form.reset()
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Registrar Horas</h3>
          <p className="text-sm text-muted-foreground">Añade una nueva entrada de tiempo para este ticket.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describa el trabajo realizado..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Registrar Horas</Button>
      </form>
    </Form>
  )
} 