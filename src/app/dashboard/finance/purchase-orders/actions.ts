"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";

const purchaseOrderItemSchema = z.object({
    partId: z.string().min(1, 'El repuesto es obligatorio.'),
    quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
    cost: z.coerce.number().min(0, 'El costo no puede ser negativo.'),
});

const purchaseOrderSchema = z.object({
    supplierId: z.string().min(1, 'El proveedor es obligatorio.'),
    status: z.string().min(1, 'El estado es obligatorio.'),
    notes: z.string().optional(),
    items: z
        .array(purchaseOrderItemSchema)
        .min(1, 'La orden de compra debe tener al menos un ítem.'),
});

export async function createPurchaseOrder(data: unknown) {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return { success: false, message: 'No autorizado.' }
    }

    const validation = purchaseOrderSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, message: 'Datos inválidos.', errors: validation.error.flatten().fieldErrors }
    }

    const { supplierId, items, totalAmount, notes } = validation.data;
    const orderNumber = await generateOrderNumber();

    try {
        await prisma.$transaction(async (tx) => {
            const newOrder = await tx.purchaseOrder.create({
                data: {
                    orderNumber,
                    supplierId,
                    totalAmount,
                    notes,
                    status: 'DRAFT',
                }
            });

            const itemsToCreate = items.map(item => ({
                ...item,
                purchaseOrderId: newOrder.id,
            }));

            await tx.purchaseOrderItem.createMany({
                data: itemsToCreate,
            });
        });
        
        revalidatePath('/dashboard/finance/purchase-orders');
        return { success: true, message: 'Orden de compra creada con éxito.' };

    } catch (error) {
        console.error("Error creating purchase order:", error);
        return { success: false, message: 'No se pudo crear la orden de compra.' };
    }
}

export async function updatePurchaseOrder(id: string, data: unknown) {
    const validationResult = purchaseOrderSchema.safeParse(data)

    if (!validationResult.success) {
        throw new Error(validationResult.error.message)
    }

    const { items, ...orderData } = validationResult.data

    await prisma.$transaction(async (tx) => {
        // 1. Update the main order details
        await tx.purchaseOrder.update({
            where: { id },
            data: orderData,
        })

        // 2. Delete old items
        await tx.purchaseOrderItem.deleteMany({
            where: { purchaseOrderId: id },
        })

        // 3. Create new items
        const itemsToCreate = items.map((item) => ({
            ...item,
            purchaseOrderId: id,
        }))

        await tx.purchaseOrderItem.createMany({
            data: itemsToCreate,
        })
    })

    revalidatePath('/dashboard/finance/purchase-orders')
    revalidatePath(`/dashboard/finance/purchase-orders/edit/${id}`)
}

export async function getPurchaseOrders() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return []
    }

    try {
        const purchaseOrders = await prisma.purchaseOrder.findMany({
            include: {
                supplier: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return purchaseOrders
    } catch (error) {
        console.error("Error fetching purchase orders:", error)
        return []
    }
}

export async function getSuppliers() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return []
    }

    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: 'asc' },
        })
        return suppliers
    } catch (error) {
        console.error("Error fetching suppliers:", error)
        return []
    }
}

export async function getParts() {
    const session = await auth()
    if (session?.user?.role !== 'ADMIN') {
        return []
    }

    try {
        const parts = await prisma.part.findMany({
            orderBy: { name: 'asc' },
        })
        return parts
    } catch (error) {
        console.error("Error fetching parts:", error)
        return []
    }
}

async function generateOrderNumber() {
    const lastOrder = await prisma.purchaseOrder.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { orderNumber: true }
    });

    const currentYear = new Date().getFullYear();
    let nextId = 1;

    if (lastOrder && lastOrder.orderNumber.startsWith(`PO-${currentYear}`)) {
        const lastId = parseInt(lastOrder.orderNumber.split('-')[2], 10);
        nextId = lastId + 1;
    }

    return `PO-${currentYear}-${String(nextId).padStart(4, '0')}`;
}