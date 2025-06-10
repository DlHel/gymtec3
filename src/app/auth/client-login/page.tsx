'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export default function ClientLoginPage() {
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/client/dashboard"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signIn("email", { email, callbackUrl })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Portal de Clientes</CardTitle>
          <CardDescription>
            Inicia sesión para gestionar tus tickets de servicio.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Iniciar Sesión con Email
            </Button>
          </CardFooter>
        </form>
        <div className="p-6 pt-0 text-center text-sm">
            <Link href="/auth/login" className="text-primary hover:underline">
                ¿Eres un empleado? Inicia sesión aquí
            </Link>
        </div>
      </Card>
    </div>
  )
} 