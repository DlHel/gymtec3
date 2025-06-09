"use client"

import { useFormState } from "react-dom"
import { updateClient, type State } from "@/app/dashboard/clients/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Client } from "@prisma/client"

interface EditClientFormProps {
    client: Client
}

export function EditClientForm({ client }: EditClientFormProps) {
    const initialState: State = { message: null, errors: {} };
    const updateClientWithId = updateClient.bind(null, client.id)
    const [state, formAction] = useFormState(updateClientWithId, initialState);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Editar Cliente</CardTitle>
                    <CardDescription>Modifique los datos del cliente y guarde los cambios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Cliente</Label>
                        <Input id="name" name="name" defaultValue={client.name} required />
                        {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rut">RUT</Label>
                        <Input id="rut" name="rut" defaultValue={client.rut} required />
                        {state.errors?.rut && <p className="text-sm text-red-500">{state.errors.rut}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={client.email} required />
                        {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" name="phone" defaultValue={client.phone ?? ''} />
                        {state.errors?.phone && <p className="text-sm text-red-500">{state.errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" name="address" defaultValue={client.address ?? ''} />
                        {state.errors?.address && <p className="text-sm text-red-500">{state.errors.address}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/clients/${client.id}`}>
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">Guardar Cambios</Button>
                </CardFooter>
            </Card>
            {state.message && <p className="text-sm text-red-500 mt-4">{state.message}</p>}
        </form>
    )
} 