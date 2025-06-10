'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const locationSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  address: z.string().min(5, 'La dirección es requerida'),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  clientId: z.string(),
})

export async function createLocation(prevState: any, formData: FormData) {
  const validatedFields = locationSchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    clientId: formData.get('clientId'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  try {
    const newLocation = await prisma.location.create({
      data: validatedFields.data,
    })

    revalidatePath(`/dashboard/clients/${validatedFields.data.clientId}`)
    return { message: `Sede "${newLocation.name}" creada.`, location: newLocation }
  } catch (e) {
    console.error(e)
    return { message: 'Error al crear la sede.' }
  }
}

const updateLocationSchema = locationSchema.extend({
  id: z.string().min(1),
})

export async function updateLocation(prevState: any, formData: FormData) {
  const validatedFields = updateLocationSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    address: formData.get('address'),
    contactName: formData.get('contactName'),
    contactPhone: formData.get('contactPhone'),
    clientId: formData.get('clientId'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  const { id, clientId, ...data } = validatedFields.data

  try {
    const updatedLocation = await prisma.location.update({
      where: { id },
      data,
    })

    revalidatePath(`/dashboard/clients/${clientId}`)
    return {
      message: `Sede "${updatedLocation.name}" actualizada.`,
      location: updatedLocation,
    }
  } catch (e) {
    console.error(e)
    return { message: 'Error al actualizar la sede.' }
  }
} 