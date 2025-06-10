'use client'

import { DataTable } from "@/components/modules/DataTable"
import { columns, ClientTicket } from "./columns"
import { useRouter } from "next/navigation"

interface ClientTicketListProps {
  data: ClientTicket[]
}

export function ClientTicketList({ data }: ClientTicketListProps) {
  const router = useRouter()

  const handleRowClick = (row: ClientTicket): string => {
    // TODO: Crear la página de detalle del ticket para el cliente
    return `/client/tickets/${row.id}`;
  }
  
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="title"
      onRowClick={handleRowClick}
    />
  )
} 