'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EquipmentForm } from './equipment-form'

interface EquipmentModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
}

export function EquipmentModal({ isOpen, onClose, clientId }: EquipmentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Equipo</DialogTitle>
          <DialogDescription>
            Rellena los detalles del nuevo equipo para este cliente. Se asignará a una de sus sedes.
          </DialogDescription>
        </DialogHeader>
        <EquipmentForm clientId={clientId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
} 