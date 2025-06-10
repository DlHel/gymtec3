import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/modules/PageHeader"
import { PurchaseOrderForm } from "../components/PurchaseOrderForm";

async function getFormData() {
    const suppliers = await prisma.supplier.findMany();
    const parts = await prisma.part.findMany();
    return { suppliers, parts };
}

export default async function NewPurchaseOrderPage() {
    const { suppliers, parts } = await getFormData();

    return (
        <div>
            <PageHeader title="Crear Orden de Compra" />
            <div className="p-8">
                <PurchaseOrderForm suppliers={suppliers} parts={parts} />
            </div>
        </div>
    )
} 