import { Client } from "@prisma/client"
import { Mail, Phone, User, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { ClientPageActions } from "./ClientPageActions"

interface ClientHeaderProps {
  client: Client
}

export default function ClientHeader({ client }: ClientHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{client.name}</h1>
        <p className="text-muted-foreground">ID: {client.id}</p>
      </div>
      <ClientPageActions client={client} />
    </div>
  )
} 