"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
      <div>
        {/* Podríamos agregar Breadcrumbs o el título de la página aquí */}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <User className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-sm font-medium">{session?.user?.name ?? "Usuario"}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  )
} 