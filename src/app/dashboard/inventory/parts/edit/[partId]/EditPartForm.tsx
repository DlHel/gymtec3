"use client"

import { useFormState } from "react-dom"
import { updatePart, type State } from "../../actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Part } from "@prisma/client"

interface EditPartFormProps {
    part: Part
}

export function EditPartForm({ part }: EditPartFormProps) {
    const initialState: State = { message: null, errors: {} };
    const updatePartWithId = updatePart.bind(null, part.id)
    const [state, formAction] = useFormState(updatePartWithId, initialState);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Editar Repuesto</CardTitle>
                    <CardDescription>Modifique los datos del repuesto y guarde los cambios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Repuesto</Label>
                        <Input id="name" name="name" defaultValue={part.name} required />
                        {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input id="sku" name="sku" defaultValue={part.sku || ''} />
                        {state.errors?.sku && <p className="text-sm text-red-500">{state.errors.sku}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock Actual</Label>
                        <Input id="stock" name="stock" type="number" defaultValue={part.stock} required />
                        {state.errors?.stock && <p className="text-sm text-red-500">{state.errors.stock}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="minStock">Stock Mínimo</Label>
                        <Input id="minStock" name="minStock" type="number" defaultValue={part.minStock} required />
                        {state.errors?.minStock && <p className="text-sm text-red-500">{state.errors.minStock}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cost">Costo</Label>
                        <Input id="cost" name="cost" type="number" step="0.01" defaultValue={part.cost || ''} />
                        {state.errors?.cost && <p className="text-sm text-red-500">{state.errors.cost}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/dashboard/inventory/parts">
                        <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit">Guardar Cambios</Button>
                </CardFooter>
            </Card>
            {state.message && <p className="text-sm text-red-500 mt-4">{state.message}</p>}
        </form>
    )
} 