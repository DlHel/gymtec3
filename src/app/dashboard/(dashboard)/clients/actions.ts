'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const session = await auth()

  if (!session?.user) {
    // O manejar el error como sea apropiado
    return []
  }

  // Si el usuario es ADMIN, puede ver todos los clientes
  if (session.user.role === 'ADMIN') {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return clients
  }

  // Si el usuario es TECHNICIAN, solo puede ver clientes a los que tiene tickets asignados
  if (session.user.role === 'TECHNICIAN') {
    const tickets = await prisma.ticket.findMany({
      where: {
        assignedToId: session.user.id,
      },
      select: {
        clientId: true,
      },
      distinct: ['clientId'],
    })

    const clientIds = tickets.map((ticket) => ticket.clientId)

    const clients = await prisma.client.findMany({
      where: {
        id: {
          in: clientIds,
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return clients
  }

  // Por defecto, no devolver clientes si el rol no está cubierto
  return []
}

export async function getClientDetails(clientId: string) {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      locations: true,
      contracts: true,
      tickets: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!client) {
    throw new Error('Cliente no encontrado')
  }

  const equipment = await prisma.equipment.findMany({
    where: {
      location: {
        clientId: clientId,
      },
    },
    include: {
      location: {
        select: {
          name: true,
        },
      },
    },
  })

  return { client, equipment }
}

const clientSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  rut: z.string().min(9, { message: 'El RUT debe tener un formato válido.' }),
  email: z.string().email({ message: 'Debe ser un email válido.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export async function updateClient(id: string, data: unknown) {
  const validatedFields = clientSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Datos de cliente inválidos.")
  }

  await prisma.client.update({
    where: { id },
    data: validatedFields.data,
  })

  revalidatePath(`/dashboard/clients/${id}`)
  revalidatePath('/dashboard/clients')
} 