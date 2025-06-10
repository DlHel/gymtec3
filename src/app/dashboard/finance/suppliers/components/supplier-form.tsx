'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { getErrorMessage } from '@/lib/handle-error'
import { Supplier } from '@prisma/client'
import { createSupplier, updateSupplier } from '../actions'
import { SubmitButton } from '@/components/ui/submit-button'

const supplierFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio.'),
  contactName: z.string().optional(),
  email: z.string().email('Por favor, introduce un email válido.').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof supplierFormSchema>

interface SupplierFormProps {
  supplier?: Supplier | null
}

export function SupplierForm({ supplier }: SupplierFormProps) {
  const router = useRouter()
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier?.name || '',
      contactName: supplier?.contactName || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
    },
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      if (supplier) {
        await updateSupplier(supplier.id, data)
        toast.success('Proveedor actualizado con éxito')
      } else {
        await createSupplier(data)
        toast.success('Proveedor creado con éxito')
      }
      router.push('/dashboard/finance/suppliers')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Proveedor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Repuestos Fitness S.A."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: contacto@repuestosfitness.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: +56 9 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Av. Providencia 123, Santiago, Chile"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SubmitButton isSubmitting={isSubmitting}>
          {supplier ? 'Actualizar Proveedor' : 'Crear Proveedor'}
        </SubmitButton>
      </form>
    </Form>
  )
} 