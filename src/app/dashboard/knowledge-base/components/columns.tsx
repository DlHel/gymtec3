'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export type KnowledgeBaseColumn = {
  id: string
  modelName: string
  _count: {
    checklists: number
  }
}

export const columns: ColumnDef<KnowledgeBaseColumn>[] = [
  {
    accessorKey: 'modelName',
    header: 'Nombre del Modelo',
  },
  {
    accessorKey: '_count.checklists',
    header: 'Nº de Checklists',
    cell: ({ row }) => {
      return row.original._count.checklists
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <Link href={`/dashboard/knowledge-base/${id}`}>
              <DropdownMenuItem>Gestionar Checklists</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 