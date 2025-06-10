'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { EquipmentStatus } from '@prisma/client'

const equipmentSchema = z.object({
  model: z.string().min(2, 'El modelo es requerido'),
  brand: z.string().min(2, 'La marca es requerida'),
  serialNumber: z.string().optional(),
  qrCode: z.string().optional(),
  locationId: z.string().min(1, 'Debe seleccionar una sede'),
  installationDate: z.coerce.date().optional(),
})

export async function createEquipment(prevState: any, formData: FormData) {
  const validatedFields = equipmentSchema.safeParse({
    model: formData.get('model'),
    brand: formData.get('brand'),
    serialNumber: formData.get('serialNumber'),
    qrCode: formData.get('qrCode'),
    locationId: formData.get('locationId'),
    installationDate: formData.get('installationDate'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  try {
    const newEquipment = await prisma.equipment.create({
      data: {
        ...validatedFields.data,
        status: EquipmentStatus.OPERATIONAL, // Default status
      },
    })

    const location = await prisma.location.findUnique({
        where: { id: newEquipment.locationId },
        select: { clientId: true }
    });

    if (location?.clientId) {
        revalidatePath(`/dashboard/clients/${location.clientId}`)
    }

    return { message: `Equipo "${newEquipment.model}" creado.`, equipment: newEquipment }
  } catch (e) {
    console.error(e)
    return { message: 'Error al crear el equipo.' }
  }
}

export async function getClientLocations(clientId: string) {
    const locations = await prisma.location.findMany({
        where: { clientId },
        orderBy: { name: 'asc' }
    });
    return locations;
} 