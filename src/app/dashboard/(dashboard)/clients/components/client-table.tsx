'use client'

import { DataTable } from "@/components/modules/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Client } from "./columns"

interface ClientTableProps {
  columns: ColumnDef<Client>[]
  data: Client[]
}

export function ClientTable({ columns, data }: ClientTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      onRowClick={(row) => `/dashboard/clients/${row.id}`}
    />
  )
} 