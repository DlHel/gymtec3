import { prisma } from '@/lib/prisma'
import { PurchaseOrderForm } from '../../components/purchase-order-form'
import { notFound } from 'next/navigation'

interface EditPurchaseOrderPageProps {
  params: {
    orderId: string
  }
}

export default async function EditPurchaseOrderPage({
  params,
}: EditPurchaseOrderPageProps) {
  const [purchaseOrder, suppliers, parts] = await Promise.all([
    prisma.purchaseOrder.findUnique({
      where: { id: params.orderId },
      include: {
        items: {
          include: {
            part: true,
          },
        },
      },
    }),
    prisma.supplier.findMany(),
    prisma.part.findMany(),
  ])

  if (!purchaseOrder) {
    notFound()
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Editar Orden de Compra
          </h2>
          <p className="text-muted-foreground">
            Modifica los detalles de la orden de compra seleccionada.
          </p>
        </div>
      </div>
      <PurchaseOrderForm
        purchaseOrder={purchaseOrder}
        suppliers={suppliers}
        parts={parts}
      />
    </div>
  )
}