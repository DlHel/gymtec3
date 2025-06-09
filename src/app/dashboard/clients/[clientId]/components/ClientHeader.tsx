import { Client } from "@prisma/client"
import { Mail, Phone, User, Hash } from "lucide-react"

interface ClientHeaderProps {
  client: Client
}

export default function ClientHeader({ client }: ClientHeaderProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md border">
      <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
        <div className="flex items-center">
          <Hash className="mr-2 h-4 w-4" />
          <span>{client.rut}</span>
        </div>
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          <a href={`mailto:${client.email}`} className="hover:underline">
            {client.email}
          </a>
        </div>
        <div className="flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          <span>{client.phone ?? "No disponible"}</span>
        </div>
      </div>
      {client.address && (
        <div className="mt-4 text-gray-600">
          <p><strong>Dirección:</strong> {client.address}</p>
        </div>
      )}
    </div>
  )
} 