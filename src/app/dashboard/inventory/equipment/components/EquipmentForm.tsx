"use client"

import { useFormState } from "react-dom"
import { createEquipment, updateEquipment, type State } from "../actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Equipment, Client, Location } from "@prisma/client"

interface EquipmentFormProps {
    equipment?: Equipment;
    clients: (Client & { locations: Location[] })[];
}

export function EquipmentForm({ equipment, clients }: EquipmentFormProps) {
    const initialState: State = { message: null, errors: {} };
    const action = equipment ? updateEquipment.bind(null, equipment.id) : createEquipment;
    const [state, formAction] = useFormState(action, initialState);

    const allLocations = clients.flatMap(client => client.locations.map(loc => ({ ...loc, clientName: client.name })));

    const formatDateForInput = (date: Date | null | undefined) => {
        if (!date) return ''
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>{equipment ? "Editar" : "Crear"} Equipo</CardTitle>
                    <CardDescription>
                        {equipment ? "Modifique los detalles del equipo." : "Rellene los datos para registrar un nuevo equipo."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marca</Label>
                            <Input id="brand" name="brand" defaultValue={equipment?.brand} required />
                            {state.errors?.brand && <p className="text-sm text-red-500">{state.errors.brand}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Modelo</Label>
                            <Input id="model" name="model" defaultValue={equipment?.model} required />
                            {state.errors?.model && <p className="text-sm text-red-500">{state.errors.model}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="serialNumber">Número de Serie (Opcional)</Label>
                        <Input id="serialNumber" name="serialNumber" defaultValue={equipment?.serialNumber ?? ''} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="locationId">Sede (Ubicación)</Label>
                        <Select name="locationId" defaultValue={equipment?.locationId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione una sede" />
                            </SelectTrigger>
                            <SelectContent>
                                {allLocations.map(location => (
                                    <SelectItem key={location.id} value={location.id}>
                                        {location.clientName} - {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state.errors?.locationId && <p className="text-sm text-red-500">{state.errors.locationId[0]}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                            <Input id="purchaseDate" name="purchaseDate" type="date" defaultValue={formatDateForInput(equipment?.purchaseDate)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="installationDate">Fecha de Instalación</Label>
                            <Input id="installationDate" name="installationDate" type="date" defaultValue={formatDateForInput(equipment?.installationDate)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/inventory/equipment">
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">{equipment ? "Guardar Cambios" : "Crear Equipo"}</Button>
                </CardFooter>
            </Card>
            {state.message && <p className="text-sm text-red-500 mt-4">{state.message}</p>}
        </form>
    )
} 