"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Client, User } from "@prisma/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createTicket } from "../actions"
import { useState } from "react"

// Esquema de validación con Zod
const formSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  clientId: z.string().nonempty("Debes seleccionar un cliente."),
  assignedToId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

interface TicketFormProps {
    clients: Client[]
    users: User[]
}

export default function TicketForm({ clients, users }: TicketFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      clientId: "",
      assignedToId: "",
      priority: "MEDIUM",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    toast.info("Creando ticket...")

    const result = await createTicket(values)

    if (result?.errors) {
        toast.error(result.message)
        // Opcional: mostrar errores de campo específicos
        // for (const key in result.errors) {
        //     const error = result.errors[key as keyof typeof result.errors];
        //     if (error) {
        //         form.setError(key as any, { type: 'manual', message: error[0] });
        //     }
        // }
    } else if (result?.message) {
        toast.error(result.message)
    } else {
        toast.success("Ticket creado exitosamente.")
        // La redirección se maneja en la Server Action
    }
    
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Mantenimiento cinta de correr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe el problema o la solicitud en detalle..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una prioridad" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="LOW">Baja</SelectItem>
                        <SelectItem value="MEDIUM">Media</SelectItem>
                        <SelectItem value="HIGH">Alta</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
          control={form.control}
          name="assignedToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asignar a Técnico</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un técnico (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">No asignar</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Puedes dejar esto en blanco y asignarlo más tarde.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Ticket"}
        </Button>
      </form>
    </Form>
  )
} 