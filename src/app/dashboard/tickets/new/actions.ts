'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  description: z.string().min(1, { message: 'La descripción es requerida' }),
  priority: z.string().min(1, { message: 'La prioridad es requerida' }),
  clientId: z.string().min(1, { message: 'Debe seleccionar un cliente' }),
  locationId: z.string().min(1, { message: 'Debe seleccionar una sede' }),
  equipmentId: z.string().optional(),
  assignedToId: z.string().optional(),
})

export async function createTicket(data: z.infer<typeof formSchema>) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId || !['ADMIN', 'TECHNICIAN'].includes(session.user.role)) {
    throw new Error('Unauthorized')
  }

  const validatedData = formSchema.safeParse(data)
  if (!validatedData.success) {
    throw new Error('Invalid data provided.')
  }

  // Ensure optional fields are null if empty string
  const dataToSave = {
    ...validatedData.data,
    createdById: userId,
    equipmentId: validatedData.data.equipmentId || null,
    assignedToId: validatedData.data.assignedToId || null,
  }

  try {
    await prisma.ticket.create({
      data: dataToSave,
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create ticket.')
  }

  revalidatePath('/dashboard/tickets')
  redirect('/dashboard/tickets')
}

export async function getTicketCreationData() {
  const clients = await prisma.client.findMany({
    include: {
      locations: {
        include: {
          equipment: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  const technicians = await prisma.user.findMany({
    where: {
      role: 'TECHNICIAN',
    },
    orderBy: {
      name: 'asc',
    },
  })

  return { clients, technicians }
} 