import { Location } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

interface LocationsTabProps {
  locations: Location[]
}

export default function LocationsTab({ locations }: LocationsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sedes y Contactos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
            <Button>Añadir Sede</Button>
        </div>
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold text-lg">{location.name}</h3>
                <div className="text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <p>{location.address}</p>
                  </div>
                  {location.phone && (
                    <div className="flex items-center mt-1">
                      <Phone className="mr-2 h-4 w-4" />
                      <p>{location.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay sedes registradas para este cliente.</p>
        )}
      </CardContent>
    </Card>
  )
} 