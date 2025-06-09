"use client"

import { useFormState } from "react-dom"
import { createClient, type State } from "../actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function CreateClientForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useFormState(createClient, initialState);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Crear Nuevo Cliente</CardTitle>
                    <CardDescription>Rellene los datos para registrar un nuevo cliente en el sistema.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Cliente</Label>
                        <Input id="name" name="name" placeholder="Ej: Gimnasio Bodytech Kennedy" required />
                        {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rut">RUT</Label>
                        <Input id="rut" name="rut" placeholder="Ej: 12.345.678-9" required />
                        {state.errors?.rut && <p className="text-sm text-red-500">{state.errors.rut}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Ej: contacto@empresa.com" required />
                        {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" name="phone" placeholder="Ej: +56 9 1234 5678" />
                        {state.errors?.phone && <p className="text-sm text-red-500">{state.errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" name="address" placeholder="Ej: Av. Providencia 123, Santiago" />
                        {state.errors?.address && <p className="text-sm text-red-500">{state.errors.address}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/clients">
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">Crear Cliente</Button>
                </CardFooter>
            </Card>
            {state.message && <p className="text-sm text-red-500 mt-4">{state.message}</p>}
        </form>
    )
} 