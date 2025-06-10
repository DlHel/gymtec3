"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const EquipmentSchema = z.object({
  model: z.string().min(2, "El modelo debe tener al menos 2 caracteres."),
  brand: z.string().min(2, "La marca debe tener al menos 2 caracteres."),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional().nullable(),
  installationDate: z.date().optional().nullable(),
  locationId: z.string({ required_error: "Debe seleccionar una ubicación." }),
})

export type State = {
  errors?: {
    model?: string[]
    brand?: string[]
    serialNumber?: string[]
    purchaseDate?: string[]
    installationDate?: string[]
    locationId?: string[]
  }
  message?: string | null
}

const parseDate = (date: any): Date | null => {
    if (!date) return null
    const d = new Date(date)
    return isNaN(d.getTime()) ? null : d
}

export async function createEquipment(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = EquipmentSchema.safeParse({
        model: formData.get("model"),
        brand: formData.get("brand"),
        serialNumber: formData.get("serialNumber"),
        purchaseDate: parseDate(formData.get("purchaseDate")),
        installationDate: parseDate(formData.get("installationDate")),
        locationId: formData.get("locationId"),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Error de validación." }
    }

    try {
        await prisma.equipment.create({ data: validatedFields.data });
    } catch (error) {
        return { message: "Error de base de datos: No se pudo crear el equipo." }
    }

    revalidatePath("/dashboard/inventory/equipment")
    redirect("/dashboard/inventory/equipment")
}

export async function updateEquipment(id: string, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = EquipmentSchema.safeParse({
        model: formData.get("model"),
        brand: formData.get("brand"),
        serialNumber: formData.get("serialNumber"),
        purchaseDate: parseDate(formData.get("purchaseDate")),
        installationDate: parseDate(formData.get("installationDate")),
        locationId: formData.get("locationId"),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Error de validación." }
    }

    try {
        await prisma.equipment.update({ where: { id }, data: validatedFields.data });
    } catch (error) {
        return { message: "Error de base de datos: No se pudo actualizar el equipo." }
    }

    revalidatePath("/dashboard/inventory/equipment")
    redirect("/dashboard/inventory/equipment")
}

export async function deleteEquipment(id: string) {
    try {
        await prisma.equipment.delete({ where: { id } });
        revalidatePath("/dashboard/inventory/equipment");
        return { message: "Equipo eliminado exitosamente." };
    } catch (error) {
        return { message: "Error de base de datos: No se pudo eliminar el equipo." };
    }
}

export async function getEquipment() {
  const equipment = await prisma.equipment.findMany({
    include: {
      location: {
        include: {
          client: true,
        },
      },
    },
    orderBy: {
      location: {
        client: {
          name: 'asc',
        },
      },
    },
  })

  // We are mapping the data to flatten the structure for easier column access
  // and to ensure we are only sending the necessary data to the client.
  return equipment
} 