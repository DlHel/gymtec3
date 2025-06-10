"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const PartSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  sku: z.string().optional(),
  stock: z.coerce.number().int().nonnegative("El stock no puede ser negativo."),
  minStock: z.coerce.number().int().nonnegative("El stock mínimo no puede ser negativo."),
  cost: z.coerce.number().nonnegative("El costo no puede ser negativo.").optional().or(z.literal('')),
})

export type State = {
  errors?: {
    name?: string[]
    sku?: string[]
    stock?: string[]
    minStock?: string[]
    cost?: string[]
  }
  message?: string | null
}

export async function createPart(prevState: State, formData: FormData): Promise<State> {
  
  const validatedFields = PartSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    stock: formData.get("stock"),
    minStock: formData.get("minStock"),
    cost: formData.get("cost") || 0,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrija los campos.",
    }
  }

  const { name, sku, stock, minStock, cost } = validatedFields.data

  try {
    await prisma.part.create({
      data: {
        name,
        stock,
        minStock,
        sku: sku || null,
        cost: cost || null,
      }
    })
  } catch (error) {
    return {
      message: "Error de base de datos: No se pudo crear el repuesto.",
    }
  }

  revalidatePath("/dashboard/inventory/parts")
  redirect("/dashboard/inventory/parts")
}

export async function updatePart(id: string, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = PartSchema.safeParse({
        name: formData.get("name"),
        sku: formData.get("sku"),
        stock: formData.get("stock"),
        minStock: formData.get("minStock"),
        cost: formData.get("cost") || 0,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Por favor, corrija los campos.",
        };
    }

    const { name, sku, stock, minStock, cost } = validatedFields.data;

    try {
        await prisma.part.update({
            where: { id },
            data: {
                name,
                sku,
                stock,
                minStock,
                cost: cost || null,
            },
        });
    } catch (error) {
        return { message: "Error de base de datos: No se pudo actualizar el repuesto." };
    }

    revalidatePath("/dashboard/inventory/parts");
    redirect("/dashboard/inventory/parts");
}

export async function deletePart(id: string) {
    try {
        await prisma.part.delete({
            where: { id },
        });
        revalidatePath("/dashboard/inventory/parts");
        return { message: "Repuesto eliminado exitosamente." };
    } catch (error) {
        return { message: "Error de base de datos: No se pudo eliminar el repuesto." };
    }
}

export async function getParts() {
  const parts = await prisma.part.findMany({
    include: {
      supplier: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  // Map to include supplierName and a flag for low stock
  return parts.map((part) => ({
    ...part,
    supplierName: part.supplier?.name ?? 'N/A',
    isLowStock: part.stock <= part.minStock,
  }))
} 