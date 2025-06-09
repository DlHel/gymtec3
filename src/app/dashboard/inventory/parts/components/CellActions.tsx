"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Part } from "@prisma/client"
import Link from "next/link"
import { deletePart } from "../actions"

interface CellActionsProps {
    part: Part
}

async function handleDelete(part: Part) {
    try {
        return await deletePart(part.id);
    } catch (error) {
        return { message: "Error inesperado al eliminar el repuesto." };
    }
}

export function CellActions({ part }: CellActionsProps) {
    const [loading, setLoading] = useState(false)

    const onDelete = async () => {
        try {
            setLoading(true)
            const result = await handleDelete(part)
            
            if (result.message.includes("Error")) {
                toast.error(result.message)
            } else {
                toast.success(result.message)
            }
        } catch (error) {
            toast.error("Error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Link href={`/dashboard/inventory/parts/edit/${part.id}`}>
                    <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={loading}
                    onClick={onDelete}
                    className="text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 