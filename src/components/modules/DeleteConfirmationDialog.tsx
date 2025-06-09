"use client"

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
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

interface DeleteConfirmationDialogProps {
    onConfirm: () => Promise<{ message: string }>;
    itemName: string;
    children?: React.ReactNode;
}

export function DeleteConfirmationDialog({ onConfirm, itemName, children }: DeleteConfirmationDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleConfirm = () => {
        startTransition(async () => {
            const result = await onConfirm();
            if (result.message.startsWith("Error")) {
                toast.error(result.message);
            } else {
                toast.success(result.message);
            }
            setIsOpen(false);
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                {children || (
                     <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el elemento <span className="font-semibold">{itemName}</span> y borrará sus datos de nuestros servidores.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                        {isPending ? "Eliminando..." : "Sí, eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 