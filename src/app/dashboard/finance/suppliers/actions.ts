"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/lib/auth"

const supplierSchema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
    email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
    phone: z.string().min(8, { message: 'El teléfono debe tener al menos 8 dígitos.' }).optional().or(z.literal('')),
    address: z.string().optional(),
    contactPerson: z.string().optional(),
    rut: z.string().optional(),
})

export async function createSupplier(data: unknown) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, message: 'No autorizado.' }
    }

    const validation = supplierSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Datos inválidos.', errors: validation.error.flatten().fieldErrors }
    }
    
    try {
        await prisma.supplier.create({
            data: validation.data
        });
        
        revalidatePath('/dashboard/finance/suppliers');
        return { success: true, message: 'Proveedor creado con éxito.' };
    } catch (error: any) {
        if (error.code === 'P2002') { // Unique constraint failed
            return { success: false, message: 'Ya existe un proveedor con ese nombre o RUT.' };
        }
        console.error("Error creating supplier:", error);
        return { success: false, message: 'No se pudo crear el proveedor.' };
    }
}

export async function updateSupplier(id: string, data: unknown) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, message: 'No autorizado.' }
    }

    const validation = supplierSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Datos inválidos.', errors: validation.error.flatten().fieldErrors }
    }
    
    try {
        await prisma.supplier.update({
            where: { id },
            data: validation.data
        });
        
        revalidatePath('/dashboard/finance/suppliers');
        return { success: true, message: 'Proveedor actualizado con éxito.' };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, message: 'Ya existe un proveedor con ese nombre o RUT.' };
        }
        console.error("Error updating supplier:", error);
        return { success: false, message: 'No se pudo actualizar el proveedor.' };
    }
}

export async function getSuppliers() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return []
  }

  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    })
    return suppliers
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }
}

export async function getSupplierById(id: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return null
  }
  
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
    })
    return supplier
  } catch (error) {
    console.error("Error fetching supplier by id:", error)
    return null
  }
}

export async function deleteSupplier(supplierId: string) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, message: 'No autorizado.' }
    }

    try {
        // Opcional: Verificar si el proveedor tiene órdenes de compra antes de borrar
        const existingPOs = await prisma.purchaseOrder.count({
            where: { supplierId: supplierId }
        });

        if (existingPOs > 0) {
            return { success: false, message: 'No se puede eliminar un proveedor con órdenes de compra asociadas.' };
        }
        
        await prisma.supplier.delete({
            where: { id: supplierId }
        });

        revalidatePath('/dashboard/finance/suppliers');
        return { success: true, message: 'Proveedor eliminado con éxito.' };

    } catch (error) {
        console.error("Error deleting supplier:", error);
        return { success: false, message: 'No se pudo eliminar el proveedor.' };
    }
} 
