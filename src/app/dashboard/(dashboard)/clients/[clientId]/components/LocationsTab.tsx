'use client'

import { useState } from 'react'
import { Location } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { LocationModal } from './locations/location-modal'
import { PlusCircle, MapPin, Phone, User } from 'lucide-react'

interface LocationsTabProps {
  locations: Location[]
  clientId: string
}

export function LocationsTab({ locations, clientId }: LocationsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  const handleEdit = (location: Location) => {
    setSelectedLocation(location)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedLocation(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLocation(null)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Sede
        </Button>
      </div>

      {locations.length > 0 ? (
        <div className="space-y-4">
          {locations.map(location => (
            <button
              key={location.id}
              onClick={() => handleEdit(location)}
              className="w-full text-left p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center mt-2">
                <MapPin className="mr-2 h-4 w-4" />
                {location.address}
              </p>
              {(location.contactName || location.contactPhone) && (
                <div className="border-t mt-3 pt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {location.contactName && (
                     <p className="text-sm text-muted-foreground flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {location.contactName}
                    </p>
                  )}
                  {location.contactPhone && (
                     <p className="text-sm text-muted-foreground flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      {location.contactPhone}
                    </p>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-dashed border-2 rounded-lg">
          <p className="text-muted-foreground">No hay sedes para este cliente.</p>
          <Button variant="link" onClick={handleAddNew}>
            Añadir la primera sede
          </Button>
        </div>
      )}

      <LocationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        clientId={clientId}
        location={selectedLocation}
      />
    </div>
  )
} 