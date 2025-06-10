'use client'

import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { Location } from '@prisma/client'
import { Barcode, QrCode } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createEquipment, getClientLocations } from './actions'
import { QrScanner } from '@/components/ui/qr-scanner'
import { SubmitButton } from '@/components/ui/submit-button'

interface EquipmentFormProps {
  clientId: string
  onClose: () => void
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  clientId,
  onClose,
}) => {
  const initialState = { message: null, errors: {} }
  const [state, dispatch] = useFormState(createEquipment, initialState)
  const [locations, setLocations] = useState<Location[]>([])
  const [
    scannerConfig,
    setScannerConfig,
  ] = useState<{ isOpen: boolean; scanType: 'qr' | 'barcode' }>({
    isOpen: false,
    scanType: 'qr',
  })
  const [internalCode, setInternalCode] = useState('')

  useEffect(() => {
    getClientLocations(clientId).then(setLocations)
  }, [clientId])

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

  const handleScanSuccess = (decodedText: string) => {
    setInternalCode(decodedText)
    setScannerConfig({ isOpen: false, scanType: 'qr' }) // Close scanner
    toast.success('Código escaneado con éxito.')
  }

  const handleFormAction = (formData: FormData) => {
    formData.set('qrCode', internalCode)
    dispatch(formData)
  }

  return (
    <>
      {scannerConfig.isOpen && (
        <QrScanner
          scanType={scannerConfig.scanType}
          onScanSuccess={handleScanSuccess}
          onClose={() => setScannerConfig({ ...scannerConfig, isOpen: false })}
        />
      )}

      <form action={handleFormAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="locationId">Sede del Equipo</Label>
          <Select name="locationId" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una sede..." />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.locationId && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.locationId[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Ej: Life Fitness"
              required
            />
            {state.errors?.brand && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.brand[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              name="model"
              placeholder="Ej: Trotadora 95T"
              required
            />
            {state.errors?.model && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.model[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Número de Serie</Label>
          <Input id="serialNumber" name="serialNumber" placeholder="Opcional" />
          {state.errors?.serialNumber && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.serialNumber[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="qrCode">Código Interno (QR o Barras)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="qrCode"
              name="qrCode"
              placeholder="Opcional"
              value={internalCode}
              onChange={e => setInternalCode(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setScannerConfig({ isOpen: true, scanType: 'qr' })
              }
            >
              <QrCode className="h-4 w-4" />
              <span className="sr-only">Escanear Código QR</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                setScannerConfig({ isOpen: true, scanType: 'barcode' })
              }
            >
              <Barcode className="h-4 w-4" />
              <span className="sr-only">Escanear Código de Barras</span>
            </Button>
          </div>
          {state.errors?.qrCode && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.qrCode[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="installationDate">Fecha de Instalación</Label>
          <Input id="installationDate" name="installationDate" type="date" />
          {state.errors?.installationDate && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.installationDate[0]}
            </p>
          )}
        </div>


        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancelar
          </Button>
          <SubmitButton>Guardar Equipo</SubmitButton>
        </div>
      </form>
    </>
  )
} 