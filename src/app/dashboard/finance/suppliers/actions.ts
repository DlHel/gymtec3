"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const supplierSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    contactName: z.string().optional(),
    email: z.string().email("Debe ser un email válido.").optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
})

export async function createSupplier(formData: FormData) {
    const validatedFields = supplierSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Faltan campos.",
        };
    }
    
    try {
        await prisma.supplier.create({
            data: validatedFields.data,
        });
    } catch (error) {
        return {
            message: "Error de base de datos: No se pudo crear el proveedor.",
        };
    }

    revalidatePath("/dashboard/finance/suppliers");
    redirect("/dashboard/finance/suppliers");
}

export async function updateSupplier(id: string, formData: FormData) {
    const validatedFields = supplierSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Faltan campos.",
        };
    }

    try {
        await prisma.supplier.update({
            where: { id },
            data: validatedFields.data,
        });
    } catch (error) {
        return { message: "Error de base de datos: No se pudo actualizar el proveedor." };
    }

    revalidatePath("/dashboard/finance/suppliers");
    revalidatePath(`/dashboard/finance/suppliers/edit/${id}`);
    redirect("/dashboard/finance/suppliers");
}

export async function deleteSupplier(id: string) {
    try {
        // Opcional: verificar si el proveedor tiene órdenes de compra o repuestos asociados antes de eliminar.
        // Por ahora, eliminaremos directamente.
        
        await prisma.supplier.delete({
            where: { id },
        });

        revalidatePath("/dashboard/finance/suppliers");
        return { message: "Proveedor eliminado exitosamente." };

    } catch (error) {
        return { 
            message: "Error al eliminar el proveedor.",
            errors: { _form: ["Algo salió mal."] } 
        };
    }
} 
