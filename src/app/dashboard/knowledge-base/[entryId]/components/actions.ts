'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createChecklistSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  knowledgeBaseId: z.string(),
})

const taskSchema = z.object({
  id: z.string(),
  text: z.string().min(1, { message: 'La tarea no puede estar vacía' }),
})

const updateTasksSchema = z.object({
  checklistId: z.string(),
  tasks: z.array(taskSchema),
})

export async function createChecklist(data: unknown) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validatedData = createChecklistSchema.safeParse(data)
  if (!validatedData.success) {
    throw new Error('Invalid data provided.')
  }
  
  const { name, knowledgeBaseId } = validatedData.data

  await prisma.checklist.create({
    data: {
      name,
      knowledgeBaseId,
      tasks: '[]', // Start with an empty array of tasks
    },
  })

  revalidatePath(`/dashboard/knowledge-base/${knowledgeBaseId}`)
}

export async function updateChecklistTasks(data: unknown) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validatedData = updateTasksSchema.safeParse(data)
  if (!validatedData.success) {
    throw new Error('Invalid data provided.')
  }

  const { checklistId, tasks } = validatedData.data

  const entry = await prisma.checklist.findUnique({
    where: { id: checklistId },
    select: { knowledgeBaseId: true },
  })

  if (!entry) {
    throw new Error('Checklist not found')
  }

  await prisma.checklist.update({
    where: {
      id: checklistId,
    },
    data: {
      tasks: JSON.stringify(tasks),
    },
  })

  revalidatePath(`/dashboard/knowledge-base/${entry.knowledgeBaseId}`)
} 