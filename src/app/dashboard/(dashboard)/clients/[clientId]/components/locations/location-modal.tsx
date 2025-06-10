'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LocationForm } from './location-form'
import { Location } from '@prisma/client'

interface LocationModalProps {
  clientId: string
  location?: Location | null
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode // To trigger the modal
}

export const LocationModal = ({
  clientId,
  location,
  isOpen,
  onClose,
  children,
}: LocationModalProps) => {
  const title = location ? 'Editar Sede' : 'Crear Nueva Sede'
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <LocationForm clientId={clientId} location={location} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
} 