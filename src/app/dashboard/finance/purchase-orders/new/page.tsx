import { Heading } from "@/components/ui/heading"
import { getSuppliers, getParts } from "../actions"
import { PurchaseOrderForm } from "./components/PurchaseOrderForm"

export default async function NewPurchaseOrderPage() {
  const [suppliers, parts] = await Promise.all([
    getSuppliers(),
    getParts()
  ])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Crear Orden de Compra"
        description="Complete el formulario para crear una nueva orden de compra."
      />
      <PurchaseOrderForm suppliers={suppliers} parts={parts} />
    </div>
  )
}