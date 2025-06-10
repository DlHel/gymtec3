"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Client, Quote, Ticket } from "@prisma/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { TrashIcon } from "lucide-react"

const formSchema = z.object({
    clientId: z.string().min(1, "Debe seleccionar un cliente."),
    ticketId: z.string().optional(),
    status: z.string(),
    notes: z.string().optional(),
    items: z.array(z.object({
        description: z.string().min(1, "La descripci贸n es obligatoria."),
        quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
        unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
    })).min(1, "Debe agregar al menos un 铆tem."),
});

interface QuoteFormProps {
    quote?: Quote;
    clients: Client[];
    tickets: Ticket[];
}

export function QuoteForm({ quote, clients, tickets }: QuoteFormProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            clientId: quote?.clientId || "",
            ticketId: quote?.ticketId || "",
            status: quote?.status || "DRAFT",
            notes: quote?.notes || "",
            items: [{ description: "", quantity: 1, unitPrice: 0 }]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        toast.info("Funcionalidad de guardado en desarrollo.");
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
                
                {/* Items de la Cotizaci贸n */}
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold">脥tems de la Cotizaci贸n</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">
                           <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Descripci贸n</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Descripci贸n del 铆tem" {...field} />
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
                        Agregar 脥tem
                    </Button>
                </div>

                <div className="flex justify-end">
                    <Button type="submit">
                        Guardar Cotizaci贸n
                    </Button>
                </div>
            </form>
        </Form>
    )
}
"use client"`n`nimport { zodResolver } from "@hookform/resolvers/zod";`nimport { useFieldArray, useForm, useFormState } from "react-hook-form";`nimport * as z from "zod";`nimport { useRouter } from "next/navigation";`nimport { useEffect, useTransition } from "react";`nimport { toast } from "sonner";`nimport { Client, Quote, Ticket } from "@prisma/client";`nimport { createQuote } from "../actions";`nimport { Button } from "@/components/ui/button";`nimport { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";`nimport { Input } from "@/components/ui/input";`nimport { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";`nimport { TrashIcon } from "lucide-react";`nimport { Textarea } from "@/components/ui/textarea";`n`nconst formSchema = z.object({`n  clientId: z.string().min(1, "Debe seleccionar un cliente."),`n  ticketId: z.string().optional(),`n  status: z.string(),`n  notes: z.string().optional(),`n  items: z.array(z.object({`n    description: z.string().min(1, "La descripci髇 es obligatoria."),`n    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),`n    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),`n  })).min(1, "Debe agregar al menos un 韙em."),`n});`n
`ninterface QuoteFormProps {`n    quote?: Quote & { items: { description: string; quantity: number; unitPrice: number; }[] };`n    clients: Client[];`n    tickets: Ticket[];`n}`n`nexport function QuoteForm({ quote, clients, tickets }: QuoteFormProps) {`n    const router = useRouter();`n    const [isPending, startTransition] = useTransition();`n`n    const form = useForm<z.infer<typeof formSchema>>({`n        resolver: zodResolver(formSchema),`n        defaultValues: {`n            clientId: quote?.clientId || "",`n            ticketId: quote?.ticketId || "",`n            status: quote?.status || "DRAFT",`n            notes: quote?.notes || "",`n            items: quote?.items || [{ description: "", quantity: 1, unitPrice: 0 }]`n        },`n    })`n`n    const { fields, append, remove } = useFieldArray({`n        control: form.control,`n        name: "items"`n    });`n`n    const { errors } = useFormState({ control: form.control });`n`n    const onSubmit = (values: z.infer<typeof formSchema>) => {`n        const formData = new FormData();`n        formData.append("clientId", values.clientId);`n        if (values.ticketId) formData.append("ticketId", values.ticketId);`n        formData.append("status", values.status);`n        if (values.notes) formData.append("notes", values.notes);`n        formData.append("items", JSON.stringify(values.items));`n`n        startTransition(() => {`n            createQuote(formData).then((res) => {`n                if (res?.errors) {`n                    toast.error(res.message);`n                } else {`n                    toast.success("Cotizaci髇 creada exitosamente.");`n                    router.push("/dashboard/finance/quotes");`n                }`n            })`n        });`n    }`n`n    return (`n        <Form {...form}>`n            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">`n                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">`n                    <FormField`n                        control={form.control}`n                        name="clientId"`n                        render={({ field }) => (`n                            <FormItem>`n                                <FormLabel>Cliente</FormLabel>`n                                <Select onValueChange={field.onChange} defaultValue={field.value}>`n                                    <FormControl>`n                                        <SelectTrigger>`n                                            <SelectValue placeholder="Seleccione un cliente" />`n                                        </SelectTrigger>`n                                    </FormControl>`n                                    <SelectContent>`n                                        {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}`n                                    </SelectContent>`n                                </Select>`n                                <FormMessage />`n                            </FormItem>`n                        )}`n                    />`n                    <FormField`n                        control={form.control}`n                        name="ticketId"`n                        render={({ field }) => (`n                            <FormItem>`n                                <FormLabel>Ticket (Opcional)</FormLabel>`n                                <Select onValueChange={field.onChange} defaultValue={field.value}>`n                                    <FormControl>`n                                        <SelectTrigger>`n                                            <SelectValue placeholder="Asociar un ticket" />`n                                        </SelectTrigger>`n                                    </FormControl>`n                                    <SelectContent>`n                                        <SelectItem value="">Ninguno</SelectItem>`n                                        {tickets.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}`n                                    </SelectContent>`n                                </Select>`n                                <FormMessage />`n                            </FormItem>`n                        )}`n                    />`n                </div>`n                `n                {/* Items de la Cotizaci髇 */}`n                 <div className="space-y-4">`n                    <h3 className="text-lg font-semibold">蛅ems de la Cotizaci髇</h3>`n                    {fields.map((field, index) => (`n                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">`n                           <FormField`n                                control={form.control}`n                                name={`items.${index}.description`}`n                                render={({ field }) => (`n                                    <FormItem className="flex-1">`n                                        <FormLabel>Descripci髇</FormLabel>`n                                        <FormControl>`n                                            <Input placeholder="Descripci髇 del 韙em" {...field} />`n                                        </FormControl>`n                                        <FormMessage />`n                                    </FormItem>`n                                )}`n                            />`n                             <FormField`n                                control={form.control}`n                                name={`items.${index}.quantity`}`n                                render={({ field }) => (`n                                    <FormItem>`n                                        <FormLabel>Cantidad</FormLabel>`n                                        <FormControl>`n                                            <Input type="number" {...field} />`n                                        </FormControl>`n                                        <FormMessage />`n                                    </FormItem>`n                                )}`n                            />`n                             <FormField`n                                control={form.control}`n                                name={`items.${index}.unitPrice`}`n                                render={({ field }) => (`n                                    <FormItem>`n                                        <FormLabel>Precio Unitario</FormLabel>`n                                        <FormControl>`n                                            <Input type="number" {...field} />`n                                        </FormControl>`n                                        <FormMessage />`n                                    </FormItem>`n                                )}`n                            />`n                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>`n                                <TrashIcon className="h-4 w-4" />`n                            </Button>`n                        </div>`n                    ))}`n                    <Button type="button" variant="outline" onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}>`n                        Agregar 蛅em`n                    </Button>`n                </div>`n`n                <div className="flex justify-end">`n                    <Button type="submit" disabled={isPending}>`n                        {isPending ? "Guardando..." : "Guardar Cotizaci髇"}`n                    </Button>`n                </div>`n            </form>`n        </Form>`n    )`n}
