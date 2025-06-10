"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Supplier } from "@prisma/client"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteSupplier } from "../actions"
import { toast } from "sonner"
import { startTransition } from "react"

export const columns: ColumnDef<Supplier>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
    },
    {
        accessorKey: "contactName",
        header: "Contacto",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const supplier = row.original

            const handleDelete = async () => {
                startTransition(async () => {
                    const result = await deleteSupplier(supplier.id);
                    if (result?.errors) {
                        toast.error(result.message);
                    } else {
                        toast.success(result.message);
                    }
                });
            }

            return (
                <AlertDialog>
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
                                <Link href={`/dashboard/finance/suppliers/edit/${supplier.id}`}>Editar</Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem>
                                    <span className="text-red-500">Eliminar</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente al proveedor y todos sus datos asociados del servidor.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                                Sí, eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
        },
    },
] 