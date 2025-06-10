'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Part, Supplier } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition, useEffect } from 'react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TrashIcon } from 'lucide-react'
import { createPurchaseOrder } from '../../actions'

const purchaseOrderItemSchema = z.object({
  partId: z.string().min(1, 'Seleccione un repuesto'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1'),
  unitPrice: z.coerce.number().min(0, 'El precio no puede ser negativo'),
})

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Debe seleccionar un proveedor'),
  notes: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).min(1, 'Debe añadir al menos un repuesto'),
})

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>

interface PurchaseOrderFormProps {
  suppliers: Supplier[]
  parts: Part[]
}

export function PurchaseOrderForm({ suppliers, parts }: PurchaseOrderFormProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplierId: '',
      notes: '',
      items: [{ partId: '', quantity: 1, unitPrice: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const watchItems = form.watch('items')
  const totalAmount = watchItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0)

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name?.startsWith('items')) {
        const partsMap = new Map(parts.map(p => [p.id, p.cost]))
        const indexStr = name.match(/items\.(\d+)\.partId/)?.[1]
        if (indexStr) {
          const index = parseInt(indexStr, 10)
          const partId = value.items?.[index]?.partId
          if (partId) {
            const cost = partsMap.get(partId) || 0
            form.setValue(`items.${index}.unitPrice`, cost)
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, parts])

  const onSubmit = (data: PurchaseOrderFormValues) => {
    startTransition(async () => {
      // Pass the calculated total amount along with the form data
      const result = await createPurchaseOrder({ ...data, totalAmount });
      if (result.success) {
        toast.success('Orden de compra creada con éxito.')
        router.push('/dashboard/finance/purchase-orders')
      } else {
        toast.error(result.message || 'Hubo un error al crear la orden.')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Orden de Compra</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un proveedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Instrucciones especiales, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Repuestos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-md">
                  <Controller
                    name={`items.${index}.partId`}
                    control={form.control}
                    render={({ field: controllerField }) => (
                       <FormItem className="col-span-12 md:col-span-5">
                         <FormLabel className="text-xs">Repuesto</FormLabel>
                         <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parts.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>)}
                          </SelectContent>
                        </Select>
                       </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.quantity`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-6 md:col-span-2">
                        <FormLabel className="text-xs">Cantidad</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.unitPrice`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-6 md:col-span-3">
                        <FormLabel className="text-xs">Precio Unit. (CLP)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="col-span-12 md:col-span-2 flex justify-end items-end h-full">
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                   <div className="col-span-12"><FormMessage>{form.formState.errors.items?.[index]?.partId?.message || form.formState.errors.items?.[index]?.quantity?.message || form.formState.errors.items?.[index]?.unitPrice?.message}</FormMessage></div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <Button type="button" variant="outline" onClick={() => append({ partId: '', quantity: 1, unitPrice: 0 })}>
              Añadir Repuesto
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
              <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent>
               <div className="text-2xl font-bold text-right">
                Total: {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalAmount)}
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creando Orden...' : 'Crear Orden de Compra'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
} 