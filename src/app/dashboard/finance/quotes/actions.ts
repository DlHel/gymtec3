'use server'

import { z } from 'zod';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const formSchema = z.object({
    clientId: z.string().min(1),
    ticketId: z.string().optional(),
    status: z.string(),
    notes: z.string().optional(),
    items: z.preprocess(
        (val) => (typeof val === 'string' ? JSON.parse(val) : val),
        z.array(z.object({
            description: z.string().min(1),
            quantity: z.coerce.number().min(1),
            unitPrice: z.coerce.number().min(0),
        })).min(1)
    ),
});

async function generateQuoteNumber() {
    const lastQuote = await db.quote.findFirst({
        orderBy: { quoteNumber: 'desc' },
        select: { quoteNumber: true }
    });

    if (!lastQuote) {
        return 'COT-0001';
    }

    const lastNumber = parseInt(lastQuote.quoteNumber.split('-')[1]);
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `COT-${newNumber}`;
}

export async function createQuote(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = formSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Error de validación. Faltan campos o son inválidos.',
        };
    }

    const data = validatedFields.data;
    const quoteNumber = await generateQuoteNumber();
    const total = data.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

    try {
        await db.quote.create({
            data: {
                quoteNumber,
                clientId: data.clientId,
                ticketId: data.ticketId || null,
                status: data.status,
                notes: data.notes,
                total,
                items: {
                    create: data.items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    }))
                }
            }
        });
    } catch (error) {
        console.error(error);
        return { message: "Error de la base de datos: no se pudo crear la cotización." };
    }

    revalidatePath('/dashboard/finance/quotes');
    redirect('/dashboard/finance/quotes');
}
