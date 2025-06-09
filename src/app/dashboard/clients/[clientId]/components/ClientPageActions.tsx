"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { Client } from "@prisma/client"
import { DeleteConfirmationDialog } from "@/components/modules/DeleteConfirmationDialog"
import { deleteClient } from "../../actions"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ClientPageActionsProps {
    client: Client
}

export function ClientPageActions({ client }: ClientPageActionsProps) {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteClient(client.id);
        if (result.message.startsWith("Error")) {
            toast.error(result.message);
        } else {
            toast.success(result.message);
            router.push("/dashboard/clients");
        }
        return result;
    }

    return (
        <div className="flex items-center gap-2">
            <Link href={`/dashboard/clients/edit/${client.id}`}>
                <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                </Button>
            </Link>
            <DeleteConfirmationDialog onConfirm={handleDelete} itemName={client.name}>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                </Button>
            </DeleteConfirmationDialog>
        </div>
    )
} 