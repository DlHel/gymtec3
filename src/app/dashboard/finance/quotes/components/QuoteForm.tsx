"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useFormState } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"
import { toast } from "sonner"
import { Client, Quote, Ticket } from "@prisma/client"
import { createQuote } from "../actions"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrashIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    ticketId: z.string().optional(),
    status: z.string(),
    notes: z.string().optional(),
    items: z.array(z.object({
        description: z.string().min(1, "La descripción es obligatoria."),
        quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
        unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
    })).min(1, "Debe agregar al menos un ítem."),
});

interface QuoteFormProps {
    quote?: Quote & { items: { description: string; quantity: number; unitPrice: number; }[] };
    clients: Client[];
    tickets: Ticket[];
}

export function QuoteForm({ quote, clients, tickets }: QuoteFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientId: quote?.clientId || "",
            ticketId: quote?.ticketId || "",
            status: quote?.status || "DRAFT",
            notes: quote?.notes || "",
            items: quote?.items || [{ description: "", quantity: 1, unitPrice: 0 }]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("clientId", values.clientId);
        if (values.ticketId) formData.append("ticketId", values.ticketId);
        formData.append("status", values.status);
        if (values.notes) formData.append("notes", values.notes);
        formData.append("items", JSON.stringify(values.items));

        startTransition(() => {
            createQuote(formData).then((res) => {
                if (res?.errors) {
                    toast.error(res.message);
                } else {
                    toast.success("Cotización creada exitosamente.");
                    router.push("/dashboard/finance/quotes");
                }
            })
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un cliente" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Asociar un ticket" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="">Ninguno</SelectItem>
                                        {tickets.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ítems de la Cotización</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">
                           <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Descripción del ítem" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad</FormLabel>
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
                                    <FormItem>
                                        <FormLabel>Precio Unitario</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}>
                        Agregar Ítem
                    </Button>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Guardando..." : "Guardar Cotización"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
