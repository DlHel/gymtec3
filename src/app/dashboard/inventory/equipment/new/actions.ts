'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function getClientsAndLocations() {
  const clients = await prisma.client.findMany({
    include: {
      locations: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
  return clients
}

const formSchema = z.object({
  model: z.string().min(1, { message: 'El modelo es requerido' }),
  brand: z.string().min(1, { message: 'La marca es requerida' }),
  serialNumber: z.string().optional(),
  cost: z.coerce.number().optional(),
  locationId: z.string().min(1, { message: 'Debe seleccionar una sede' }),
})

export async function createEquipment(data: z.infer<typeof formSchema>) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validatedData = formSchema.safeParse(data)

  if (!validatedData.success) {
    throw new Error('Invalid data provided.')
  }

  try {
    await prisma.equipment.create({
      data: validatedData.data,
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create equipment in the database.')
  }

  revalidatePath('/dashboard/inventory/equipment')
  redirect('/dashboard/inventory/equipment')
} 