"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Supplier } from '@prisma/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  phone: z.string().min(8, { message: 'El teléfono debe tener al menos 8 dígitos.' }).optional().or(z.literal('')),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  rut: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof formSchema>

interface SupplierFormProps {
  initialData: Supplier | null
  onSubmit: (data: SupplierFormValues) => Promise<any>
}

export const SupplierForm: React.FC<SupplierFormProps> = ({ initialData, onSubmit }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const title = initialData ? 'Editar Proveedor' : 'Nuevo Proveedor'
  const description = initialData ? 'Edita los detalles del proveedor.' : 'Añade un nuevo proveedor a la lista.'
  const action = initialData ? 'Guardar Cambios' : 'Crear Proveedor'

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      phone: '',
      address: '',
      contactPerson: '',
      rut: '',
    },
  })

  const processSubmit = (data: SupplierFormValues) => {
    startTransition(() => {
        toast.promise(onSubmit(data), {
            loading: `${initialData ? 'Actualizando' : 'Creando'} proveedor...`,
            success: (res) => {
                if (res.success) {
                    router.push('/dashboard/finance/suppliers')
                    return res.message
                }
                throw new Error(res.message)
            },
            error: (err) => err.message
        })
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Nombre del proveedor" {...field} />
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
                    <Input disabled={isPending} placeholder="Email de contacto" {...field} />
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
                    <Input disabled={isPending} placeholder="Teléfono de contacto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Dirección del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persona de Contacto</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Nombre del contacto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUT</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="RUT del proveedor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} className="ml-auto" type="submit">
            {isPending ? 'Guardando...' : action}
          </Button>
        </form>
      </Form>
    </>
  )
}
