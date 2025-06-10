"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Supplier } from "@prisma/client"
import { createSupplier, updateSupplier } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    name: z.string().min(3, "El nombre es obligatorio."),
    contactName: z.string().optional(),
    email: z.string().email("Debe ser un email válido.").optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
})

interface SupplierFormProps {
    supplier?: Supplier
}

export function SupplierForm({ supplier }: SupplierFormProps) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: supplier?.name || "",
            contactName: supplier?.contactName || "",
            email: supplier?.email || "",
            phone: supplier?.phone || "",
            address: supplier?.address || "",
        },
    })

    const isSubmitting = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                formData.append(key, value);
            }
        });

        const result = supplier
            ? await updateSupplier(supplier.id, formData)
            : await createSupplier(formData);

        if (result?.errors) {
            toast.error(result.message);
        } else {
            toast.success(`Proveedor ${supplier ? 'actualizado' : 'creado'} exitosamente.`);
            router.push("/dashboard/finance/suppliers");
            router.refresh();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Proveedor</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Repuestos Acme S.A." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Contacto</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Juan Pérez" {...field} />
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
                                    <Input placeholder="+56 9 1234 5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="contacto@acme.com" {...field} />
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
                                <Textarea placeholder="Av. Siempre Viva 123, Springfield" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Guardando..." : (supplier ? "Guardar Cambios" : "Crear Proveedor")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
