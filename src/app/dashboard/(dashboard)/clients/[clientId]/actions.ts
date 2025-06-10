'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const clientSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  rut: z.string().min(9, 'El RUT no es válido'),
  email: z.string().email('El email no es válido'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export async function updateClient(
  clientId: string,
  prevState: any,
  formData: FormData
) {
  const validatedFields = clientSchema.safeParse({
    name: formData.get('name'),
    rut: formData.get('rut'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  try {
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: validatedFields.data,
    })

    if (!updatedClient) {
      return { message: 'No se pudo actualizar el cliente.' }
    }

    revalidatePath(`/dashboard/clients`)
    revalidatePath(`/dashboard/clients/${clientId}`)

    return { message: `Cliente ${updatedClient.name} actualizado.`, client: updatedClient }
  } catch (e) {
    return { message: 'Error al actualizar el cliente en la base de datos.' }
  }
}

export async function getClientDetails(clientId: string) {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
    include: {
      locations: true,
      contracts: true,
      tickets: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      // We'll fetch equipment through locations to maintain the hierarchy
    },
  })

  if (!client) {
    notFound()
  }

  // Now, let's get all equipment associated with this client's locations
  const locationIds = client.locations.map((loc) => loc.id)
  const equipment = await prisma.equipment.findMany({
    where: {
      locationId: {
        in: locationIds,
      },
    },
    include: {
      location: true, // include location to know where each equipment is
    },
    orderBy: {
      installationDate: 'desc',
    },
  })

  return { client, equipment }
} 