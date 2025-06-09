"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface TicketPageActionsProps {
    ticketId: string
}

export function TicketPageActions({ ticketId }: TicketPageActionsProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            // Aquí iría la llamada a deleteTicket cuando esté implementada
            // await deleteTicket(ticketId)
            toast.success('Ticket eliminado exitosamente')
            router.push('/dashboard/tickets')
        } catch (error) {
            toast.error('Error al eliminar el ticket')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="flex gap-2">
            <Link href={`/dashboard/tickets/edit/${ticketId}`}>
                <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                </Button>
            </Link>
            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente 
                            el ticket y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
} 