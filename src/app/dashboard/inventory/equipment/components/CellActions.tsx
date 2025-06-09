"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Equipment } from "@prisma/client"
import { DeleteConfirmationDialog } from "@/components/modules/DeleteConfirmationDialog"
import { deleteEquipment } from "../actions"

interface CellActionsProps {
    equipment: Equipment
}

export function CellActions({ equipment }: CellActionsProps) {

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
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/inventory/equipment/edit/${equipment.id}`}>Editar</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DeleteConfirmationDialog onConfirm={() => deleteEquipment(equipment.id)} itemName={`${equipment.brand} ${equipment.model}`}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                        Eliminar
                    </DropdownMenuItem>
                </DeleteConfirmationDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 