"use client"

import { useEffect, useState, useTransition } from "react"
import { getChecklistsByKnowledgeBaseId, updateTicketChecklistState } from "@/app/dashboard/tickets/actions"
import { Checklist } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader } from "lucide-react"

interface TicketChecklistProps {
    modelName: string;
    ticketId: string;
    initialChecklistStateJSON: string | null;
}

export function TicketChecklist({ modelName, ticketId, initialChecklistStateJSON }: TicketChecklistProps) {
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
    const [checkedState, setCheckedState] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {
        getChecklistsByKnowledgeBaseId(modelName).then(data => {
            setChecklists(data);
            setIsLoading(false);
        });
        
        try {
            const initialState = initialChecklistStateJSON ? JSON.parse(initialChecklistStateJSON) : [];
            setCheckedState(Array.isArray(initialState) ? initialState : []);
        } catch (e) {
            setCheckedState([]);
        }

    }, [modelName, initialChecklistStateJSON]);

    const handleChecklistChange = (checklistId: string) => {
        const checklist = checklists.find(c => c.id === checklistId);
        setSelectedChecklist(checklist || null);
    };

    const handleCheckboxChange = (index: number) => {
        const newCheckedState = checkedState.includes(index)
            ? checkedState.filter(i => i !== index)
            : [...checkedState, index];
        
        setCheckedState(newCheckedState);

        startTransition(async () => {
            const result = await updateTicketChecklistState(ticketId, newCheckedState);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    const checklistItems = Array.isArray(selectedChecklist?.items) ? selectedChecklist?.items : [];

    if (isLoading) {
        return <Card><CardHeader><CardTitle>Cargando Checklists...</CardTitle></CardHeader></Card>
    }
    
    if (checklists.length === 0) {
        return null; // No mostrar nada si no hay checklists para este modelo
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Checklist de Trabajo</span>
                    {isPending && <Loader className="animate-spin h-5 w-5" />}
                </CardTitle>
                 <Select onValueChange={handleChecklistChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un checklist..." />
                    </SelectTrigger>
                    <SelectContent>
                        {checklists.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.title} ({c.type})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            {selectedChecklist && (
                <CardContent className="space-y-2">
                    {checklistItems.map((item: any, index) => (
                         <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                            <Checkbox 
                                id={`item-${index}`}
                                checked={checkedState.includes(index)}
                                onCheckedChange={() => handleCheckboxChange(index)}
                            />
                            <Label htmlFor={`item-${index}`} className="flex-1 cursor-pointer">
                                {item.text}
                            </Label>
                        </div>
                    ))}
                </CardContent>
            )}
        </Card>
    )
} 