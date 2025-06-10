"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const itemSchema = z.object({
    partId: z.string().optional(),
    description: z.string().min(1, "La descripción es obligatoria."),
    quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1."),
    unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const formSchema = z.object({
    supplierId: z.string().min(1, "Debe seleccionar un proveedor."),
    status: z.string(),
    // issueDate: z.coerce.date(), // Zod y FormData no se llevan bien con las fechas
    // expectedDeliveryDate: z.coerce.date().optional(),
    notes: z.string().optional(),
    items: z.array(itemSchema).min(1, "Debe agregar al menos un ítem."),
});

export async function createPurchaseOrder(formData: FormData) {
    const values = {
        supplierId: formData.get("supplierId"),
        status: formData.get("status"),
        notes: formData.get("notes"),
        items: JSON.parse(formData.get("items") as string)
    };

    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos. No se pudo crear la orden de compra.",
        };
    }

    const { supplierId, status, notes, items } = validatedFields.data;

    const total = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    try {
        await db.$transaction(async (prisma) => {
            const newOrder = await prisma.purchaseOrder.create({
                data: {
                    supplierId,
                    status,
                    notes,
                    total,
                    poNumber: `PO-${Date.now()}`, // Número de orden simple por ahora
                },
            });

            const itemsData = items.map(item => ({
                ...item,
                purchaseOrderId: newOrder.id,
            }));

            await prisma.purchaseOrderItem.createMany({
                data: itemsData,
            });
        });
    } catch (error) {
        return {
            message: "Error de base de datos: No se pudo crear la orden de compra.",
        };
    }

    revalidatePath("/dashboard/finance/purchase-orders");
    redirect("/dashboard/finance/purchase-orders");
}

export async function updatePurchaseOrder(orderId: string, formData: FormData) {
    const values = {
        supplierId: formData.get("supplierId"),
        status: formData.get("status"),
        notes: formData.get("notes"),
        items: JSON.parse(formData.get("items") as string)
    };

    const validatedFields = formSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Faltan campos. No se pudo actualizar la orden de compra.",
        };
    }

    const { supplierId, status, notes, items } = validatedFields.data;
    const total = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    try {
        await db.$transaction(async (prisma) => {
            // 1. Actualizar la orden
            await prisma.purchaseOrder.update({
                where: { id: orderId },
                data: {
                    supplierId,
                    status,
                    notes,
                    total,
                },
            });

            // 2. Eliminar items antiguos
            await prisma.purchaseOrderItem.deleteMany({
                where: { purchaseOrderId: orderId },
            });

            // 3. Crear nuevos items
            const itemsData = items.map(item => ({
                ...item,
                purchaseOrderId: orderId,
            }));

            await prisma.purchaseOrderItem.createMany({
                data: itemsData,
            });
        });

    } catch (error) {
        return {
            message: "Error de base de datos: No se pudo actualizar la orden de compra.",
        };
    }

    revalidatePath(`/dashboard/finance/purchase-orders`);
    revalidatePath(`/dashboard/finance/purchase-orders/edit/${orderId}`);
    redirect(`/dashboard/finance/purchase-orders/edit/${orderId}`);
}