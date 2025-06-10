'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Client, Equipment, Location } from '@prisma/client'
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
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createEquipment } from '../new/actions'

const formSchema = z.object({
  model: z.string().min(1, { message: 'El modelo es requerido' }),
  brand: z.string().min(1, { message: 'La marca es requerida' }),
  serialNumber: z.string().optional(),
  cost: z.coerce.number().optional(),
  locationId: z.string().min(1, { message: 'Debe seleccionar una sede' }),
})

type EquipmentFormValues = z.infer<typeof formSchema>

interface EquipmentFormProps {
  initialData?: Equipment
  clients: (Client & { locations: Location[] })[]
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialData,
  clients,
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    // Find client ID from initial data's locationId if available
    clients.find((c) =>
      c.locations.some((l) => l.id === initialData?.locationId)
    )?.id
  )

  const title = initialData ? 'Editar Equipo' : 'Nuevo Equipo'
  const toastMessage = initialData ? 'Equipo actualizado.' : 'Equipo creado.'
  const action = initialData ? 'Guardar cambios' : 'Crear Equipo'

  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      serialNumber: initialData.serialNumber ?? '',
      cost: initialData.cost ?? 0,
    } : {
      model: '',
      brand: '',
      serialNumber: '',
      locationId: '',
      cost: 0,
    },
  })

  const onSubmit = async (data: EquipmentFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        // Handle update logic here in the future
        toast.info('La lógica de actualización será implementada a continuación.')
      } else {
        await createEquipment(data)
      }
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Algo salió mal.')
    } finally {
      setLoading(false)
    }
  }

  const selectedClient = clients.find((c) => c.id === selectedClientId)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Client Selector */}
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select
              onValueChange={(value) => {
                setSelectedClientId(value)
                form.setValue('locationId', '') // Reset location when client changes
              }}
              defaultValue={selectedClientId}
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

          {/* Location Selector */}
          <FormField
            control={form.control}
            name="locationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sede</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Cinta PRO-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="TechnoGym" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Serie</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="TG-12345ABC" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo (Admin)</FormLabel>
                <FormControl>
                  <Input type="number" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={loading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  )
} 