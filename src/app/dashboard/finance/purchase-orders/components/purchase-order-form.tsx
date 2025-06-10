'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ChevronsUpDown, PlusCircle, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/lib/handle-error'
import { PurchaseOrder } from '@prisma/client'
import { Part, Supplier } from '@prisma/client'
import { SubmitButton } from '@/components/ui/submit-button'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { createPurchaseOrder, updatePurchaseOrder } from '../actions'

const purchaseOrderItemSchema = z.object({
  partId: z.string().min(1, 'El repuesto es obligatorio.'),
  partName: z.string(), // To display in the form
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  cost: z.coerce.number().min(0, 'El costo no puede ser negativo.'),
})

const purchaseOrderFormSchema = z.object({
  supplierId: z.string().min(1, 'El proveedor es obligatorio.'),
  status: z.string().min(1, 'El estado es obligatorio.'),
  notes: z.string().optional(),
  items: z
    .array(
      purchaseOrderItemSchema.omit({
        partName: true, // partName is not part of the DB model
      })
    )
    .min(1, 'La orden de compra debe tener al menos un ítem.'),
})

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>

// This type is for the form's internal state, including the partName
type FormInternalValues = z.infer<typeof purchaseOrderFormSchema> & {
  items: { partName: string }[]
}

interface PurchaseOrderFormProps {
  purchaseOrder?:
    | (PurchaseOrder & { items: { part: Part; quantity: number; cost: number }[] })
    | null
  suppliers: Supplier[]
  parts: Part[]
}

export function PurchaseOrderForm({
  purchaseOrder,
  suppliers,
  parts,
}: PurchaseOrderFormProps) {
  const router = useRouter()
  const form = useForm<FormInternalValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      supplierId: purchaseOrder?.supplierId || '',
      status: purchaseOrder?.status || 'PENDING',
      notes: purchaseOrder?.notes || '',
      items:
        purchaseOrder?.items.map((item) => ({
          partId: item.part.id,
          partName: item.part.name,
          quantity: item.quantity,
          cost: item.cost,
        })) || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const {
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    try {
      if (purchaseOrder) {
        await updatePurchaseOrder(purchaseOrder.id, data)
        toast.success('Orden de compra actualizada con éxito')
      } else {
        await createPurchaseOrder(data)
        toast.success('Orden de compra creada con éxito')
      }
      router.push('/dashboard/finance/purchase-orders')
      router.refresh()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Ítems de la Orden de Compra</CardTitle>
                <CardDescription>
                  Añade los repuestos que deseas ordenar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end p-4 border rounded-md"
                    >
                      <div className="md:col-span-4">
                        <p className="font-medium text-sm">Repuesto</p>
                        <p>{field.partName}</p>
                      </div>
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Cant.</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.cost`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Costo Unit.</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Orden</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proveedor</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'w-full justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? suppliers.find(
                                    (s) => s.id === field.value
                                  )?.name
                                : 'Seleccionar proveedor'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar proveedor..." />
                            <CommandList>
                              <CommandEmpty>
                                No se encontró el proveedor.
                              </CommandEmpty>
                              <CommandGroup>
                                {suppliers.map((s) => (
                                  <CommandItem
                                    value={s.name}
                                    key={s.id}
                                    onSelect={() => {
                                      form.setValue('supplierId', s.id)
                                    }}
                                  >
                                    {s.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PENDING">Pendiente</SelectItem>
                          <SelectItem value="ORDERED">Ordenada</SelectItem>
                          <SelectItem value="SHIPPED">Enviada</SelectItem>
                          <SelectItem value="RECEIVED">Recibida</SelectItem>
                          <SelectItem value="CANCELLED">Cancelada</SelectItem>
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
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Añadir notas o instrucciones especiales..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Añadir Repuestos</CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Buscar y añadir repuesto
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar repuesto..." />
                      <CommandList>
                        <CommandEmpty>No se encontró el repuesto.</CommandEmpty>
                        <CommandGroup>
                          {parts.map((p) => (
                            <CommandItem
                              value={p.name}
                              key={p.id}
                              onSelect={() => {
                                append({
                                  partId: p.id,
                                  partName: p.name,
                                  quantity: 1,
                                  cost: p.cost || 0,
                                })
                              }}
                            >
                              {p.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>
        </div>
        <SubmitButton isSubmitting={isSubmitting}>
          {purchaseOrder ? 'Actualizar Orden' : 'Crear Orden'}
        </SubmitButton>
      </form>
    </Form>
  )
} 