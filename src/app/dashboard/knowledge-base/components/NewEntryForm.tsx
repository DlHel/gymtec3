'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createKnowledgeBaseEntry } from '../actions'

const formSchema = z.object({
  modelName: z.string().min(2, 'El nombre del modelo debe tener al menos 2 caracteres.'),
})

export function NewEntryForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { modelName: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createKnowledgeBaseEntry(values.modelName)
    if (result.success) {
      toast.success(`Entrada "${result.data?.model}" creada exitosamente.`)
      form.reset()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cinta Corredora Pro-5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Crear Entrada</Button>
      </form>
    </Form>
  )
} 