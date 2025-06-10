'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, ChevronsUpDown, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/lib/handle-error'
import { Client, Quote, Ticket } from '@prisma/client'
import { SubmitButton } from '@/components/ui/submit-button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { createQuote, updateQuote, QuoteFormValues } from '../actions'

const quoteItemSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria.'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  unitPrice: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
})

const quoteFormSchema = z.object({
  clientId: z.string().min(1, 'El cliente es obligatorio.'),
  ticketId: z.string().optional().nullable(),
  status: z.string().min(1, 'El estado es obligatorio.'),
  issueDate: z.date({
    required_error: 'La fecha de emisión es obligatoria.',
  }),
  expiryDate: z.date({
    required_error: 'La fecha de vencimiento es obligatoria.',
  }),
  notes: z.string().optional(),
  items: z
    .array(quoteItemSchema)
    .min(1, 'La cotización debe tener al menos un ítem.'),
})

type QuoteWithItems = Quote & {
  items: { description: string; quantity: number; unitPrice: number }[]
}

interface QuoteFormProps {
  quote?: QuoteWithItems | null
  clients: Client[]
  tickets: (Ticket & { client: { id: string } })[]
}

export function QuoteForm({ quote, clients, tickets }: QuoteFormProps) {
  const router = useRouter()
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      clientId: quote?.clientId || '',
      ticketId: quote?.ticketId || null,
      status: quote?.status || 'PENDING',
      issueDate: quote?.issueDate ? new Date(quote.issueDate) : new Date(),
      expiryDate: quote?.expiryDate
        ? new Date(quote.expiryDate)
        : new Date(new Date().setDate(new Date().getDate() + 30)),
      notes: quote?.notes || '',
      items: quote?.items || [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const {
    formState: { isSubmitting },
  } = form

  const selectedClientId = useWatch({
    control: form.control,
    name: 'clientId',
  })

  const filteredTickets = tickets.filter(
    (t) => t.clientId === selectedClientId
  )

  const onSubmit = async (data: QuoteFormValues) => {
    try {
      if (quote) {
        await updateQuote(quote.id, data)
        toast.success('Cotización actualizada correctamente')
      } else {
        await createQuote(data)
        toast.success('Cotización creada correctamente')
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Ítems de la Cotización</CardTitle>
                <CardDescription>
                  Añade los servicios o productos a cotizar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-8 gap-4 items-start p-4 border rounded-md"
                    >
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-4">
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Precio Unit.</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="md:col-span-1 self-center">
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    append({ description: '', quantity: 1, unitPrice: 0 })
                  }
                >
                  Añadir Ítem
                </Button>
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
                <CardTitle>Detalles de la Cotización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {field.value
                                ? clients.find((c) => c.id === field.value)
                                    ?.name
                                : 'Seleccionar cliente'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar cliente..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                              <CommandGroup>
                                {clients.map((c) => (
                                  <CommandItem
                                    value={c.name}
                                    key={c.id}
                                    onSelect={() => {
                                      form.setValue('clientId', c.id)
                                      form.setValue('ticketId', null) // Reset ticket selection
                                    }}
                                  >
                                    {c.name}
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
                  name="ticketId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket (Opcional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                              disabled={!selectedClientId}
                            >
                              {field.value
                                ? tickets.find((t) => t.id === field.value)
                                    ?.title
                                : 'Seleccionar ticket'}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar ticket..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron tickets.</CommandEmpty>
                              <CommandGroup>
                                {filteredTickets.map((t) => (
                                  <CommandItem
                                    value={t.title}
                                    key={t.id}
                                    onSelect={() => {
                                      form.setValue('ticketId', t.id)
                                    }}
                                  >
                                    {t.title}
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
                          <SelectItem value="APPROVED">Aprobada</SelectItem>
                          <SelectItem value="REJECTED">Rechazada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Emisión</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Vencimiento</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Elige una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas / Términos</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Garantía de 30 días en la reparación..."
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
          </div>
        </div>
        <SubmitButton isSubmitting={isSubmitting}>
          {quote ? 'Actualizar Cotización' : 'Crear Cotización'}
        </SubmitButton>
      </form>
    </Form>
  )
} 