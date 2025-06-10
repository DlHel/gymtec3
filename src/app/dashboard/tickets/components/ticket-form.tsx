'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Client, Equipment, Location, User } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createTicket } from '../new/actions'

const formSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  priority: z.string().min(1, { message: 'La prioridad es requerida' }),
  clientId: z.string().min(1, { message: 'Debe seleccionar un cliente' }),
  locationId: z.string().min(1, { message: 'Debe seleccionar una sede' }),
  equipmentId: z.string().optional(),
  assignedToId: z.string().optional(),
})

type TicketFormValues = z.infer<typeof formSchema>

type ClientWithLocationsAndEquipment = Client & {
  locations: (Location & { equipment: Equipment[] })[]
}

interface TicketFormProps {
  clients: ClientWithLocationsAndEquipment[]
  technicians: User[]
}

export const TicketForm: React.FC<TicketFormProps> = ({
  clients,
  technicians,
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [selectedLocationId, setSelectedLocationId] = useState<string>('')

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      clientId: '',
      locationId: '',
      equipmentId: '',
      assignedToId: '',
    },
  })

  const onSubmit = async (data: TicketFormValues) => {
    try {
      setLoading(true)
      await createTicket(data)
      toast.success('Ticket creado con éxito')
    } catch (error) {
      toast.error('Algo salió mal.')
    } finally {
      setLoading(false)
    }
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId)
  const selectedLocation = selectedClient?.locations.find(
    (l) => l.id === selectedLocationId
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Client, Location, Equipment Selection */}
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedClientId(value)
                    form.setValue('locationId', '')
                    form.setValue('equipmentId', '')
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
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
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sede</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedLocationId(value)
                    form.setValue('equipmentId', '')
                  }}
                  defaultValue={field.value}
                  disabled={!selectedClient}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una sede" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedClient?.locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
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
            name="equipmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipo (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedLocation}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un equipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedLocation?.equipment.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.model} ({equipment.brand})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title and Description */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Título del Ticket</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Ej: La cinta de correr #3 hace un ruido extraño"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Descripción Detallada del Problema</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Describe el problema con el mayor detalle posible..."
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Priority and Assignment */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una prioridad" />
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
          <FormField
            control={form.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asignar a Técnico (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un técnico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit">
          Crear Ticket
        </Button>
      </form>
    </Form>
  )
} 