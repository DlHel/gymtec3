"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { startTransition } from "react"
import { useRouter } from "next/navigation"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { TrashIcon } from "lucide-react"

import { Part, PurchaseOrder, Supplier } from "@prisma/client"
import { createPurchaseOrder, updatePurchaseOrder } from "../actions"

const formSchema = z.object({
    supplierId: z.string().min(1, "Debe seleccionar un proveedor."),
    status: z.string(),
    issueDate: z.string(),
    expectedDeliveryDate: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(z.object({
        partId: z.string().optional(),
        description: z.string().min(1, "La descripción es obligatoria."),
        quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
        unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
    })).min(1, "Debe agregar al menos un ítem."),
});

interface PurchaseOrderFormProps {
    purchaseOrder?: PurchaseOrder & { items: { partId: string | null; description: string; quantity: number; unitPrice: number; }[] };
    suppliers: Supplier[];
    parts: Part[];
}

export function PurchaseOrderForm({ purchaseOrder, suppliers, parts }: PurchaseOrderFormProps) {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supplierId: purchaseOrder?.supplierId || "",
            status: purchaseOrder?.status || "DRAFT",
            notes: purchaseOrder?.notes || "",
            items: purchaseOrder?.items.length ? purchaseOrder.items.map(item => ({...item, partId: item.partId || undefined})) : [{ description: "", quantity: 1, unitPrice: 0 }]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("supplierId", values.supplierId);
        formData.append("status", values.status);
        if (values.notes) formData.append("notes", values.notes);
        
        formData.append("items", JSON.stringify(values.items));

        startTransition(() => {
            const action = purchaseOrder 
                ? updatePurchaseOrder(purchaseOrder.id, formData) 
                : createPurchaseOrder(formData);

            action.then((res) => {
                if (res?.errors) {
                    toast.error(res.message)
                } else {
                    toast.success(`Orden de compra ${purchaseOrder ? 'actualizada' : 'creada'} exitosamente.`)
                }
            })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Campos Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Borrador</SelectItem>
                                        <SelectItem value="ORDERED">Ordenado</SelectItem>
                                        <SelectItem value="PARTIALLY_RECEIVED">Parcialmente Recibido</SelectItem>
                                        <SelectItem value="RECEIVED">Recibido</SelectItem>
                                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                {/* Items de la Orden */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Ítems de la Orden</h3>
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

                {/* Notas y Botón de Envío */}
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas Adicionales</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Instrucciones especiales, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Guardando..." : (purchaseOrder ? "Guardar Cambios" : "Crear Orden")}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 

