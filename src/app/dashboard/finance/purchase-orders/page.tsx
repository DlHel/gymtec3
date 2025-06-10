import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/modules/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PurchaseOrdersDataTable } from "./components/PurchaseOrdersDataTable";
import { columns } from "./components/columns";

async function getPurchaseOrders() {
    const orders = await prisma.purchaseOrder.findMany({
        include: {
            supplier: true,
        },
        orderBy: {
            issueDate: 'desc'
        }
    });
    return orders;
}


export default async function PurchaseOrdersPage() {
    const orders = await getPurchaseOrders();

    return (
        <div>
            <PageHeader title="Órdenes de Compra">
                <Button asChild>
                    <Link href="/dashboard/finance/purchase-orders/new">Crear Orden</Link>
                </Button>
            </PageHeader>
            <PurchaseOrdersDataTable columns={columns} data={orders} />
        </div>
    );
}
