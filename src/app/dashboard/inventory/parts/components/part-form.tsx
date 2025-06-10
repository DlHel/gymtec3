'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Part, Supplier } from '@prisma/client'
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
import { createPart } from '../new/actions'

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  sku: z.string().optional(),
  cost: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, { message: 'El stock no puede ser negativo' }),
  minStock: z.coerce.number().int().min(0, { message: 'El stock mínimo no puede ser negativo' }),
  supplierId: z.string().optional(),
})

type PartFormValues = z.infer<typeof formSchema>

interface PartFormProps {
  initialData?: Part
  suppliers: Supplier[]
}

export const PartForm: React.FC<PartFormProps> = ({
  initialData,
  suppliers,
}) => {
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar Repuesto' : 'Nuevo Repuesto'
  const toastMessage = initialData ? 'Repuesto actualizado.' : 'Repuesto creado.'
  const action = initialData ? 'Guardar cambios' : 'Crear Repuesto'

  const form = useForm<PartFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { 
          ...initialData,
          sku: initialData.sku ?? '',
          cost: initialData.cost ?? undefined, 
          supplierId: initialData.supplierId ?? undefined 
        }
      : {
          name: '',
          sku: '',
          cost: 0,
          stock: 0,
          minStock: 0,
          supplierId: '',
        },
  })

  const onSubmit = async (data: PartFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        // Handle update logic
        toast.info('La lógica de actualización será implementada a continuación.')
      } else {
        await createPart(data)
      }
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Algo salió mal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Correa de transmisión" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="CT-PRO-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
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
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Actual</FormLabel>
                <FormControl>
                  <Input type="number" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" disabled={loading} {...field} />
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
                <FormLabel>Costo Unitario</FormLabel>
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