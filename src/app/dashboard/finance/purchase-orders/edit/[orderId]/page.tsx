import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/modules/PageHeader";
import { PurchaseOrderForm } from "../../components/PurchaseOrderForm";

async function getOrderData(orderId: string) {
    const purchaseOrder = await db.purchaseOrder.findUnique({
        where: { id: orderId },
        include: {
            items: true,
        },
    });

    if (!purchaseOrder) return { purchaseOrder: null, suppliers: [], parts: [] };

    const suppliers = await db.supplier.findMany();
    const parts = await db.part.findMany();

    return { purchaseOrder, suppliers, parts };
}


export default async function EditPurchaseOrderPage({ params }: { params: { orderId: string } }) {
    const { purchaseOrder, suppliers, parts } = await getOrderData(params.orderId);

    if (!purchaseOrder) {
        return notFound();
    }

    return (
        <div>
            <PageHeader title={`Editar Orden de Compra - ${purchaseOrder.poNumber}`} />
            <div className="p-8">
                <PurchaseOrderForm
                    purchaseOrder={purchaseOrder}
                    suppliers={suppliers}
                    parts={parts}
                />
            </div>
        </div>
    );
} 