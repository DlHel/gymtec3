"use client"

import { useFormState } from "react-dom"
import { createPart, type State } from "../actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function CreatePartForm() {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useFormState(createPart, initialState);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Crear Nuevo Repuesto</CardTitle>
                    <CardDescription>Registre un nuevo repuesto en el inventario.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Repuesto</Label>
                        <Input id="name" name="name" placeholder="Ej: Correa de Transmisión" required />
                        {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" name="sku" placeholder="Ej: CT-BELT-001" />
                        {state.errors?.sku && <p className="text-sm text-red-500">{state.errors.sku}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Actual</Label>
                        <Input id="stock" name="stock" type="number" placeholder="Ej: 10" required />
                        {state.errors?.stock && <p className="text-sm text-red-500">{state.errors.stock}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minStock">Stock Mínimo</Label>
                        <Input id="minStock" name="minStock" type="number" placeholder="Ej: 3" required />
                        {state.errors?.minStock && <p className="text-sm text-red-500">{state.errors.minStock}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cost">Costo (opcional)</Label>
                        <Input id="cost" name="cost" type="number" step="0.01" placeholder="Ej: 25000" />
                        {state.errors?.cost && <p className="text-sm text-red-500">{state.errors.cost}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/inventory/parts">
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">Crear Repuesto</Button>
                </CardFooter>
            </Card>
            {state.message && <p className="text-sm text-red-500 mt-4">{state.message}</p>}
        </form>
    )
} 