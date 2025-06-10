'use server'

import { z } from 'zod'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const session = await getServerSession(authOptions)

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

    const clientIds = tickets.map((ticket: { clientId: string }) => ticket.clientId)

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
      contracts: {
        include: {
          sla: true
        }
      },
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

export async function updateClient(
  id: string, // Pre-filled by .bind()
  prevState: { message: string; errors?: Record<string, string[]> }, // State from useFormState
  formData: FormData // New form data
): Promise<{ message: string; errors?: Record<string, string[]> }> {
  // 1. Extract data from formData
  const rawFormData = {
    name: formData.get('name'),
    rut: formData.get('rut'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  };

  // 2. Validate data
  const validatedFields = clientSchema.safeParse(rawFormData);

  // 3. Handle validation failure
  if (!validatedFields.success) {
    return {
      message: "Error de validación. Por favor, corrija los campos marcados.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 4. Handle success
  try {
    await prisma.client.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath(`/dashboard/clients/${id}`);
    revalidatePath('/dashboard/clients');
    return { message: "Cliente actualizado con éxito!", errors: {} };
  } catch (error) {
    // 5. Handle database or other errors
    console.error("Error al actualizar cliente:", error);
    // It's good practice to avoid sending raw error messages to the client
    return { message: "Error del servidor al actualizar el cliente. Intente de nuevo más tarde.", errors: {} };
  }
}