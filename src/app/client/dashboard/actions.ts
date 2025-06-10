'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export async function getClientTickets() {
  const session = await auth()
  
  if (session?.user?.role !== 'CLIENT' || !session?.user?.id) {
    // No es un cliente o no está autenticado, no debería poder llamar a esta acción
    return []
  }

  // Primero, necesitamos obtener el `clientId` del usuario logueado.
  // Asumimos que esta relación se establece cuando el usuario cliente es creado.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientId: true }
  });

  if (!user?.clientId) {
    // Este usuario cliente no está asociado a ninguna empresa cliente.
    return []
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      clientId: user.clientId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      assignedTo: true // Para mostrar el nombre del técnico
    }
  })

  return tickets
}

export async function getClientEquipment() {
  const session = await auth()
  
  if (session?.user?.role !== 'CLIENT' || !session?.user?.id) {
    return []
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientId: true }
  });

  if (!user?.clientId) {
    return []
  }

  const equipment = await prisma.equipment.findMany({
    where: {
      location: {
        clientId: user.clientId
      }
    },
    orderBy: {
      model: 'asc'
    }
  })

  return equipment
}

export async function getClientLocationsWithEquipment() {
  const session = await auth()
  
  if (session?.user?.role !== 'CLIENT' || !session?.user?.id) {
    return []
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientId: true }
  });

  if (!user?.clientId) {
    return []
  }

  const locations = await prisma.location.findMany({
    where: {
      clientId: user.clientId
    },
    include: {
      equipment: true // Incluir los equipos relacionados
    },
    orderBy: {
      name: 'asc'
    }
  })

  return locations
}

const createTicketSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  equipmentId: z.string().cuid("ID de equipo inválido."),
});

export async function createClientTicket(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== 'CLIENT' || !session?.user?.id) {
    return { success: false, message: 'No autorizado.' }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { clientId: true }
  });

  if (!user?.clientId) {
     return { success: false, message: 'Usuario no asociado a un cliente.' }
  }

  const validatedFields = createTicketSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    equipmentId: formData.get('equipmentId'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Datos inválidos.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  try {
    await prisma.ticket.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        equipmentId: validatedFields.data.equipmentId,
        clientId: user.clientId,
        createdById: session.user.id,
        // Valores por defecto: status 'OPEN', priority 'MEDIUM', no asignado
      }
    })

    revalidatePath("/client/dashboard")
    return { success: true, message: 'Ticket creado exitosamente.' }

  } catch (error) {
    console.error("Error al crear ticket:", error);
    return { success: false, message: 'No se pudo crear el ticket.' }
  }
} 