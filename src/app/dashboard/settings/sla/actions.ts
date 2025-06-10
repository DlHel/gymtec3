"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as z from "zod"

import { prisma } from "@/lib/prisma"
import { getErrorMessage } from "@/lib/handle-error"

const slaFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  responseTimeHours: z.coerce.number().min(1),
  resolutionTimeHours: z.coerce.number().min(1),
})

export async function createSla(data: unknown) {
  const validatedData = slaFormSchema.parse(data)

  try {
    await prisma.serviceLevelAgreement.create({
      data: validatedData,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }

  revalidatePath("/dashboard/settings/sla")
  redirect("/dashboard/settings/sla")
}

export async function updateSla(id: string, data: unknown) {
  const validatedData = slaFormSchema.parse(data)

  try {
    await prisma.serviceLevelAgreement.update({
      where: { id },
      data: validatedData,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }

  revalidatePath("/dashboard/settings/sla")
  revalidatePath(`/dashboard/settings/sla/edit/${id}`)
  redirect("/dashboard/settings/sla")
}

export async function deleteSla(id: string) {
  try {
    await prisma.serviceLevelAgreement.delete({
      where: { id },
    })

    revalidatePath("/dashboard/settings/sla")
    return { message: "SLA eliminado correctamente." }
  } catch (error) {
    return { message: getErrorMessage(error) }
  }
} 