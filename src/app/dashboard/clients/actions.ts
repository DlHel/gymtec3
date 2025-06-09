"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const ClientSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  rut: z.string().min(1, "El RUT es requerido."),
  email: z.string().email("Debe ser un correo electrónico válido."),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export type State = {
  errors?: {
    name?: string[]
    rut?: string[]
    email?: string[]
    phone?: string[]
    address?: string[]
  }
  message?: string | null
}

export async function createClient(prevState: State, formData: FormData): Promise<State> {
  
  const validatedFields = ClientSchema.safeParse({
    name: formData.get("name"),
    rut: formData.get("rut"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrija los campos.",
    }
  }

  const { name, rut, email, phone, address } = validatedFields.data

  try {
    await prisma.client.create({
      data: {
        name,
        rut,
        email,
        phone,
        address,
      },
    })
  } catch (error) {
    return {
      message: "Error de base de datos: No se pudo crear el cliente.",
    }
  }

  revalidatePath("/dashboard/clients")
  redirect("/dashboard/clients")

}

export async function updateClient(id: string, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = ClientSchema.safeParse({
        name: formData.get("name"),
        rut: formData.get("rut"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Por favor, corrija los campos.",
        };
    }

    const { name, rut, email, phone, address } = validatedFields.data;

    try {
        await prisma.client.update({
            where: { id },
            data: {
                name,
                rut,
                email,
                phone,
                address,
            },
        });
    } catch (error) {
        return { message: "Error de base de datos: No se pudo actualizar el cliente." };
    }

    revalidatePath(`/dashboard/clients`);
    revalidatePath(`/dashboard/clients/${id}`);
    redirect(`/dashboard/clients/${id}`);
}

export async function deleteClient(id: string) {
    try {
        const client = await prisma.client.findUnique({
            where: { id },
            include: { 
                tickets: true, 
                locations: {
                    include: {
                        equipment: true
                    }
                }
            },
        });

        if (!client) {
            return { message: "Error: Cliente no encontrado." };
        }

        const hasEquipment = client.locations.some(location => location.equipment.length > 0);
        
        if (client.tickets.length > 0 || hasEquipment) {
            return { message: "Error: No se puede eliminar un cliente con tickets o equipos asociados." };
        }

        await prisma.client.delete({
            where: { id },
        });

        revalidatePath("/dashboard/clients");
        // No redirigimos desde la acción, la página se encargará de ello
        return { message: "Cliente eliminado exitosamente." };

    } catch (error) {
        return { message: "Error de base de datos: No se pudo eliminar el cliente." };
    }
} 