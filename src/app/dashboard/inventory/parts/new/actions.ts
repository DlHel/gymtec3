'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function getSuppliers() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  return suppliers
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  sku: z.string().optional(),
  cost: z.coerce.number().optional(),
  stock: z.coerce.number().int().min(0, { message: 'El stock no puede ser negativo' }),
  minStock: z.coerce.number().int().min(0, { message: 'El stock mínimo no puede ser negativo' }),
  supplierId: z.string().optional(),
})

export async function createPart(data: z.infer<typeof formSchema>) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const validatedData = formSchema.safeParse(data)
  if (!validatedData.success) {
    throw new Error('Invalid data provided.')
  }

  try {
    await prisma.part.create({
      data: validatedData.data,
    })
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create part in the database.')
  }

  revalidatePath('/dashboard/inventory/parts')
  redirect('/dashboard/inventory/parts')
} 