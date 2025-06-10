"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getErrorMessage } from '@/lib/handle-error'

const checklistSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  tasks: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(1, "La tarea no puede estar vacía"),
  })),
  knowledgeBaseId: z.string()
})

export async function getKnowledgeBaseEntries() {
  try {
    const entries = await prisma.knowledgeBaseEntry.findMany({
      orderBy: { model: 'asc' },
    })
    return { success: true, data: entries }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function createKnowledgeBaseEntry(modelName: string) {
  try {
    const existingEntry = await prisma.knowledgeBaseEntry.findUnique({
      where: { model: modelName },
    })

    if (existingEntry) {
      return { success: false, error: 'Ya existe una entrada para este modelo.' }
    }

    const newEntry = await prisma.knowledgeBaseEntry.create({
      data: { model: modelName },
    })

    revalidatePath('/dashboard/knowledge-base')
    return { success: true, data: newEntry }
  } catch (error) {
    return { success: false, error: getErrorMessage(error) }
  }
}

export async function getKnowledgeBaseEntry(id: string) {
    try {
        const entry = await prisma.knowledgeBaseEntry.findUnique({
            where: { id },
            include: { checklists: { orderBy: { name: 'asc' } } }
        });

        if (!entry) {
            return { success: false, error: 'No se encontró la entrada.' };
        }
        return { success: true, data: entry };

    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function createOrUpdateChecklist(data: {
    id?: string;
    knowledgeBaseEntryId: string;
    name: string;
    tasks: { text: string }[];
}) {
    const { id, knowledgeBaseEntryId, name, tasks } = data;
    const tasksJson = JSON.stringify(tasks);

    try {
        if (id) {
            // Actualizar
            const updatedChecklist = await prisma.checklist.update({
                where: { id },
                data: { name, tasks: tasksJson }
            });
            revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseEntryId}`);
            return { success: true, data: updatedChecklist };
        } else {
            // Crear
            const newChecklist = await prisma.checklist.create({
                data: {
                    name,
                    tasks: tasksJson,
                    knowledgeBaseEntryId
                }
            });
            revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseEntryId}`);
            return { success: true, data: newChecklist };
        }
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function deleteChecklist(id: string, knowledgeBaseEntryId: string) {
    try {
        await prisma.checklist.delete({
            where: { id }
        });
        revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseEntryId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

// ... existing code ... 