"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { Ticket } from "@prisma/client"
import { DeleteConfirmationDialog } from "@/components/modules/DeleteConfirmationDialog"
import { deleteTicket } from "../../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface TicketPageActionsProps {
    ticket: Ticket
}

export function TicketPageActions({ ticket }: TicketPageActionsProps) {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteTicket(ticket.id);
        if (result.message.startsWith("Error")) {
            toast.error(result.message);
        } else {
            toast.success(result.message);
            router.push("/dashboard/tickets");
        }
        return result;
    }

    return (
        <div className="flex items-center gap-2">
            <Link href={`/dashboard/tickets/edit/${ticket.id}`}>
                <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Ticket
                </Button>
            </Link>
            <DeleteConfirmationDialog onConfirm={handleDelete} itemName={ticket.title}>
                <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                </Button>
            </DeleteConfirmationDialog>
        </div>
    )
} 