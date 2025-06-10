'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Client } from "@prisma/client"
import { ClientForm } from "./client-form"

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client
}

export const ClientModal = ({ isOpen, onClose, client }: ClientModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos principales del cliente.
          </DialogDescription>
        </DialogHeader>
        <ClientForm initialData={client} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
} 