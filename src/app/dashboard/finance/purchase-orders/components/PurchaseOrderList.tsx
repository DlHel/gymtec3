'use client'

import { DataTable } from "@/components/modules/DataTable"
import { columns, PurchaseOrderWithSupplier } from "./columns"
import { useRouter } from "next/navigation"

interface PurchaseOrderListProps {
  data: PurchaseOrderWithSupplier[]
}

export function PurchaseOrderList({ data }: PurchaseOrderListProps) {
  const router = useRouter()

  const handleRowClick = (row: PurchaseOrderWithSupplier) => {
    // router.push(`/dashboard/finance/purchase-orders/edit/${row.id}`)
    console.log("Navegar a:", `/dashboard/finance/purchase-orders/edit/${row.id}`)
  }
  
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="orderNumber"
      onRowClick={handleRowClick}
    />
  )
} 