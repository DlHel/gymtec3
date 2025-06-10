'use client'

import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Client } from '@prisma/client'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AddressAutocomplete } from '@/components/ui/address-autocomplete'
import { updateClient } from '../actions'

interface ClientFormProps {
  initialData: Client
  onClose: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type="submit">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </Button>
  )
}

export const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onClose,
}) => {
  const initialState = { message: null, errors: {} }
  const updateClientWithId = updateClient.bind(null, initialData.id)
  const [state, dispatch] = useFormState(updateClientWithId, initialState)
  const [address, setAddress] = useState(initialData.address || '')

  useEffect(() => {
    if (state.message && !state.errors) {
      toast.success(state.message)
      onClose()
    } else if (state.message && state.errors) {
      // Don't toast the validation error, it will be shown inline
    } else if (state.message) {
        toast.error(state.message)
    }
  }, [state, onClose])

  const handleFormAction = (formData: FormData) => {
    formData.set('address', address)
    dispatch(formData)
  }

  return (
    <form action={handleFormAction} className="space-y-4 w-full">
      <div className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            placeholder="Nombre del cliente"
            defaultValue={initialData.name}
            required
          />
          {state.errors?.name && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* RUT Field */}
        <div className="space-y-2">
          <Label htmlFor="rut">RUT</Label>
          <Input
            id="rut"
            name="rut"
            placeholder="12.345.678-9"
            defaultValue={initialData.rut}
            required
          />
          {state.errors?.rut && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.rut[0]}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="contacto@cliente.com"
            defaultValue={initialData.email}
            required
          />
          {state.errors?.email && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+56912345678"
            defaultValue={initialData.phone || ''}
          />
          {state.errors?.phone && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.phone[0]}
            </p>
          )}
        </div>

        {/* Address Field */}
        <AddressAutocomplete
            name="address"
            label="Dirección Principal"
            defaultValue={address}
            onAddressSelect={setAddress}
        />
        {state.errors?.address && (
        <p className="text-sm font-medium text-destructive -mt-2">
            {state.errors.address[0]}
        </p>
        )}
        
        {state.message && state.errors && (
          <p className="text-sm font-medium text-destructive">
            {state.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Cancelar
        </Button>
        <SubmitButton />
      </div>
    </form>
  )
} 