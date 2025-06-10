'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { Location } from '@prisma/client'

import { AddressAutocomplete } from '@/components/ui/address-autocomplete'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/ui/submit-button'
import { createLocation, updateLocation } from './actions'
import { Button } from '@/components/ui/button'

interface LocationFormProps {
  clientId: string
  location?: Location | null
  onClose: () => void
}

export const LocationForm: React.FC<LocationFormProps> = ({
  clientId,
  location,
  onClose,
}) => {
  const isEditMode = !!location
  const action = isEditMode ? updateLocation : createLocation
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(action, initialState)

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast.error(state.message)
      } else {
        toast.success(state.message)
        onClose()
      }
    }
  }, [state, onClose])

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="clientId" value={clientId} />
      {isEditMode && <input type="hidden" name="id" value={location.id} />}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Sede</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Sede Central"
          defaultValue={location?.name}
          required
        />
        {state.errors?.name && (
          <p className="text-sm font-medium text-destructive">
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <AddressAutocomplete
        name="address"
        label="Dirección"
        defaultValue={location?.address || ''}
        required
        onAddressSelect={() => {}}
      />
       {state.errors?.address && (
          <p className="text-sm font-medium text-destructive -mt-2">
            {state.errors.address[0]}
          </p>
        )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Nombre de Contacto</Label>
          <Input
            id="contactName"
            name="contactName"
            placeholder="Opcional"
            defaultValue={location?.contactName || ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            placeholder="Opcional"
            defaultValue={location?.contactPhone || ''}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Cancelar
        </Button>
        <SubmitButton>{isEditMode ? 'Actualizar Sede' : 'Crear Sede'}</SubmitButton>
      </div>
    </form>
  )
} 