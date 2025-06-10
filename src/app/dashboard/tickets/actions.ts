"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { TicketStatus, TicketPriority } from "@/types/tickets"
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getErrorMessage } from '@/lib/handle-error'

const ticketSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  clientId: z.string({ required_error: "Debe seleccionar un cliente." }),
  status: z.nativeEnum(TicketStatus),
  priority: z.nativeEnum(TicketPriority),
  assignedToId: z.string().optional().nullable(),
})

const TicketSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  clientId: z.string({ required_error: "Debe seleccionar un cliente." }),
  status: z.nativeEnum(TicketStatus),
  priority: z.nativeEnum(TicketPriority),
  assignedToId: z.string().optional().nullable(),
})

const createTicketSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  clientId: z.string().min(1, 'El cliente es obligatorio'),
  locationId: z.string().optional(),
  equipmentId: z.string().optional(),
  priority: z.string().default('MEDIUM'),
  assignedToId: z.string().optional(),
})

export type State = {
  errors?: {
    title?: string[]
    description?: string[]
    clientId?: string[]
    status?: string[]
    priority?: string[]
    assignedToId?: string[]
  }
  message?: string | null
}

async function generateTicketNumber(clientId: string) {
  const clientPart = clientId.slice(-4).toUpperCase()

  const now = new Date()
  const day = now.getDate().toString().padStart(2, '0')
  const year = now.getFullYear().toString().slice(-2)
  const datePart = `${day}${year}`

  const lastTicketToday = await prisma.ticket.findFirst({
    where: {
      ticketNumber: {
        contains: `-${datePart}-`,
      },
    },
    orderBy: {
      ticketNumber: 'desc',
    },
    select: { ticketNumber: true },
  })

  let correlative = 1
  if (lastTicketToday?.ticketNumber) {
    const lastCorrelativeStr = lastTicketToday.ticketNumber.split('-')[2]
    const lastCorrelative = parseInt(lastCorrelativeStr, 10)
    if (!isNaN(lastCorrelative)) {
      correlative = lastCorrelative + 1
    }
  }

  const correlativePart = correlative.toString().padStart(4, '0')

  return `${clientPart}-${datePart}-${correlativePart}`
}

export async function createTicket(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData)
  const validatedFields = createTicketSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      error: true,
      message: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { clientId, locationId, equipmentId, ...data } = validatedFields.data

  try {
    const ticketNumber = await generateTicketNumber(clientId)
    await prisma.ticket.create({
      data: {
        ...data,
        ticketNumber,
        client: { connect: { id: clientId } },
        ...(locationId && { location: { connect: { id: locationId } } }),
        ...(equipmentId && { equipment: { connect: { id: equipmentId } } }),
      },
    })

  } catch (error) {
    console.error(error)
    return {
      error: true,
      message: getErrorMessage(error),
    }
  }

  revalidatePath('/dashboard/tickets')
  revalidatePath(`/dashboard/clients/${clientId}`)
  redirect('/dashboard/tickets')
}

export async function updateTicket(id: string, prevState: State, formData: FormData): Promise<State> {
  const validatedFields = TicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    clientId: formData.get("clientId"),
    status: formData.get("status"),
    priority: formData.get("priority"),
    assignedToId: formData.get("assignedToId"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrija los campos.",
    };
  }

  const { title, description, clientId, status, priority, assignedToId } = validatedFields.data;

  try {
    await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        clientId,
        status,
        priority,
        assignedToId,
      },
    });
  } catch (error) {
    return { message: "Error de base de datos: No se pudo actualizar el ticket." };
  }

  revalidatePath(`/dashboard/tickets`);
  revalidatePath(`/dashboard/tickets/${id}`);
  redirect(`/dashboard/tickets/${id}`);
}

export async function deleteTicket(id: string) {
  try {
    await prisma.ticket.delete({
      where: { id },
    });
    revalidatePath("/dashboard/tickets");
    return { message: "Ticket eliminado exitosamente." };
  } catch (error) {
    return { message: "Error de base de datos: No se pudo eliminar el ticket." };
  }
}

export async function getChecklistsByKnowledgeBaseId(modelName: string) {
  const knowledgeBaseEntry = await prisma.knowledgeBaseEntry.findUnique({
    where: { model: modelName },
    include: { checklists: true }
  });
  return knowledgeBaseEntry?.checklists || [];
}

export async function updateTicketChecklistState(ticketId: string, checklistStateJSON: string) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { checklistState: checklistStateJSON },
    });
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function addPartsToTicket(ticketId: string, parts: { partId: string, quantity: number }[]) {
  'use server'
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const part of parts) {
        await tx.partUsage.create({
          data: {
            ticketId,
            partId: part.partId,
            quantity: part.quantity,
          },
        });
        await tx.part.update({
          where: { id: part.partId },
          data: {
            stock: {
              decrement: part.quantity,
            },
          },
        });
      }
    });
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

// Function to add time entry to a ticket
export async function addTimeEntry(ticketId: string, data: { hours: number; description?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: 'No autenticado' };

  try {
    await prisma.timeEntry.create({
      data: {
        ticketId,
        userId: session.user.id,
        hours: data.hours,
        description: data.description,
      }
    });
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { error: "No se pudo registrar las horas." };
  }
}

export async function addComment(ticketId: string, content: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "No autenticado" };
  try {
    await prisma.comment.create({
      data: {
        content,
        ticketId,
        userId: session.user.id,
      }
    });
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { error: "No se pudo añadir el comentario." };
  }
}

export async function getTickets() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'No autenticado' };
  }
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        ...(session.user.role !== 'ADMIN' && { assignedToId: session.user.id })
      },
      include: {
        client: true,
        assignedTo: true,
        contract: {
          include: {
            sla: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return { tickets };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

async function sendClosingNotification(ticketId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "No autenticado" };
  // Lógica para enviar email...
  console.log(`Usuario ${session.user.name} notificó cierre de ticket ${ticketId}`);
}

export async function updateTicketStatus(ticketId: string, status: string) {
  'use server'
  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status },
    });
    if (updatedTicket.status === 'PENDING_APPROVAL') {
      await sendClosingNotification(ticketId);
    }
    revalidatePath(`/dashboard/tickets/${ticketId}`);
    return { success: true };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}