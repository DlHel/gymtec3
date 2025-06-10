'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { getErrorMessage } from '@/lib/handle-error'

// This schema is used for validating the data from the form
const quoteItemSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria.'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  unitPrice: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
})

const quoteFormSchema = z.object({
  clientId: z.string().min(1, 'El cliente es obligatorio.'),
  ticketId: z.string().optional().nullable(),
  status: z.string().min(1, 'El estado es obligatorio.'),
  issueDate: z.date({ required_error: 'La fecha de emisión es obligatoria.' }),
  expiryDate: z.date({ required_error: 'La fecha de vencimiento es obligatoria.' }),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, 'La cotización debe tener al menos un ítem.'),
})

export type QuoteFormValues = z.infer<typeof quoteFormSchema>

export async function createQuote(data: QuoteFormValues) {
  const validatedFields = quoteFormSchema.safeParse(data)

  if (!validatedFields.success) {
    throw new Error('Error de validación. No se pudo crear la cotización.')
  }

  const { items, ...quoteData } = validatedFields.data
  const total = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  try {
    await prisma.$transaction(async (tx) => {
      const createdQuote = await tx.quote.create({
        data: {
          ...quoteData,
          total,
        },
      })

      const quoteItems = items.map((item) => ({
        ...item,
        quoteId: createdQuote.id,
      }))

      await tx.quoteItem.createMany({
        data: quoteItems,
      })
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }

  revalidatePath('/dashboard/finance/quotes')
  redirect('/dashboard/finance/quotes')
}

export async function updateQuote(id: string, data: QuoteFormValues) {
    const validatedFields = quoteFormSchema.safeParse(data)

    if (!validatedFields.success) {
        throw new Error('Error de validación. No se pudo actualizar la cotización.')
    }

    const { items, ...quoteData } = validatedFields.data
    const total = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

    try {
        await prisma.$transaction(async (tx) => {
            await tx.quote.update({
                where: { id },
                data: {
                    ...quoteData,
                    total
                }
            })

            await tx.quoteItem.deleteMany({
                where: { quoteId: id }
            })

            const newItems = items.map(item => ({
                ...item,
                quoteId: id
            }))

            await tx.quoteItem.createMany({
                data: newItems
            })
        })

    } catch (error) {
        throw new Error(getErrorMessage(error))
    }

    revalidatePath('/dashboard/finance/quotes')
    revalidatePath(`/dashboard/finance/quotes/edit/${id}`)
    redirect('/dashboard/finance/quotes')
}
