"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { notFound } from 'next/navigation'

const taskSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "La tarea no puede estar vacía"),
})

const checklistSchema = z.object({
  name: z.string().min(1, "El nombre del checklist es requerido"),
  tasks: z.array(taskSchema),
  knowledgeBaseId: z.string(),
})

export async function createChecklist(formData: unknown) {
  const validatedFields = checklistSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    }
  }

  const { name, tasks, knowledgeBaseId } = validatedFields.data

  try {
    await prisma.checklist.create({
      data: {
        name,
        tasks: JSON.stringify(tasks),
        knowledgeBaseId,
      },
    })
  } catch (error) {
    return {
      message: "Error de base de datos: No se pudo crear el checklist.",
    }
  }

  revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseId}`)
  return {
    message: "Checklist creado exitosamente.",
  }
}

export async function deleteChecklist(checklistId: string, knowledgeBaseId: string) {
  try {
    await prisma.checklist.delete({
      where: { id: checklistId },
    })
  } catch (error) {
    return {
      message: "Error de base de datos: No se pudo eliminar el checklist.",
    }
  }

  revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseId}`)
  return {
    message: "Checklist eliminado exitosamente.",
  }
}

export async function updateChecklist(checklistId: string, knowledgeBaseId: string, formData: unknown) {
  const validatedFields = checklistSchema.safeParse(formData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación.",
    }
  }

  const { name, tasks } = validatedFields.data

  try {
    await prisma.checklist.update({
      where: { id: checklistId },
      data: {
        name,
        tasks: JSON.stringify(tasks),
      },
    })
  } catch (error) {
    return {
      message: "Error de base de datos: No se pudo actualizar el checklist.",
    }
  }

  revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseId}`)
  return {
    message: "Checklist actualizado exitosamente.",
  }
}

export async function getKnowledgeBaseEntry(entryId: string) {
  const entry = await prisma.knowledgeBaseEntry.findUnique({
    where: {
      id: entryId,
    },
    include: {
      checklists: {
        orderBy: {
          name: 'asc',
        },
      },
    },
  })

  if (!entry) {
    notFound()
  }

  return entry
}
