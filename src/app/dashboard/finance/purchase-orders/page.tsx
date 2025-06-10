import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getPurchaseOrders } from "./actions"
import { PurchaseOrderList } from "./components/PurchaseOrderList"

export default async function PurchaseOrdersPage() {
  const purchaseOrders = await getPurchaseOrders()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Órdenes de Compra"
          description="Gestione las órdenes de compra a proveedores."
        />
        <Link href="/dashboard/finance/purchase-orders/new">
          <Button>
            + Crear Nueva Orden
          </Button>
        </Link>
      </div>
      <PurchaseOrderList data={purchaseOrders} />
    </div>
  )
}
