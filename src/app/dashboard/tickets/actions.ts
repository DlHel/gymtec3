"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TicketStatus, TicketPriority } from "@prisma/client"

const ticketSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  clientId: z.string().nonempty("Debes seleccionar un cliente."),
  assignedToId: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
})

const TicketSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  clientId: z.string({ required_error: "Debe seleccionar un cliente." }),
  status: z.nativeEnum(TicketStatus),
  priority: z.nativeEnum(TicketPriority),
  assignedToId: z.string().optional().nullable(),
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

export async function createTicket(formData: unknown) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return {
            message: "Error de autenticación: No se pudo verificar el usuario.",
        }
    }

    const validatedFields = ticketSchema.safeParse(formData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación. Faltan campos obligatorios.",
        }
    }

    const { title, description, clientId, assignedToId, priority } = validatedFields.data

    try {
        await prisma.ticket.create({
            data: {
                title,
                description,
                priority,
                status: 'OPEN', // Estado inicial por defecto
                client: { connect: { id: clientId } },
                createdBy: { connect: { id: session.user.id } },
                // Conexión opcional con el técnico
                ...(assignedToId && assignedToId !== 'unassigned' && { assignedTo: { connect: { id: assignedToId } } }),
            }
        })
    } catch (error) {
        console.error(error)
        return {
            message: "Error de base de datos: No se pudo crear el ticket.",
        }
    }

    revalidatePath("/dashboard/tickets")
    redirect("/dashboard/tickets")
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
        // Podríamos verificar errores específicos, como tickets con datos asociados que no se pueden borrar
        return { message: "Error de base de datos: No se pudo eliminar el ticket." };
    }
}

export async function updateTicketChecklistState(ticketId: string, checklistState: number[]) {
    try {
        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                checklistState: JSON.stringify(checklistState)
            }
        });
        revalidatePath(`/dashboard/tickets/${ticketId}`);
        return { success: true, message: "Progreso del checklist guardado." };
    } catch (error) {
        return { success: false, message: "Error al guardar el progreso." };
    }
} 