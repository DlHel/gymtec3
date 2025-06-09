"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

const checklistSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  tasks: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(1, "La tarea no puede estar vacía"),
  })),
  knowledgeBaseId: z.string()
})

// ... existing code ... 