"use client"

import { useEffect, useState, useTransition } from "react"
import { Checklist } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface TicketChecklistProps {
    ticketId: string
}

export function TicketChecklist({ ticketId }: TicketChecklistProps) {
    const [checklists, setChecklists] = useState<Checklist[]>([])
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        // Por ahora, solo mostramos un placeholder
        // En el futuro se puede implementar la lógica completa
        setChecklists([])
    }, [ticketId])

    if (checklists.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Verificación</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        No hay listas de verificación disponibles para este ticket.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Verificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {checklists.map((checklist) => (
                    <div key={checklist.id} className="space-y-2">
                        <h4 className="font-medium">{checklist.title}</h4>
                        <div className="space-y-1">
                            {checklist.items?.map((item: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${checklist.id}-${index}`}
                                        checked={checkedItems[`${checklist.id}-${index}`] || false}
                                        onCheckedChange={(checked) => {
                                            setCheckedItems(prev => ({
                                                ...prev,
                                                [`${checklist.id}-${index}`]: checked as boolean
                                            }))
                                        }}
                                    />
                                    <label 
                                        htmlFor={`${checklist.id}-${index}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {item}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                
                <Button 
                    onClick={() => {
                        startTransition(() => {
                            // Aquí se guardaría el estado del checklist
                            console.log('Guardando estado del checklist:', checkedItems)
                        })
                    }}
                    disabled={isPending}
                    className="w-full"
                >
                    {isPending ? 'Guardando...' : 'Guardar Progreso'}
                </Button>
            </CardContent>
        </Card>
    )
} 