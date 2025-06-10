"use client"

import { useEffect, useState, useTransition } from "react"
import { getChecklistsByKnowledgeBaseId, updateTicketChecklistState } from "@/app/dashboard/tickets/actions"
import { Checklist } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader, CheckCircle, XCircle, CircleSlash } from "lucide-react"

type ChecklistItemState = {
  status: 'ok' | 'fail' | 'na' | 'pending';
  notes: string;
}

interface TicketChecklistProps {
    modelName: string;
    ticketId: string;
    initialChecklistStateJSON: string | null;
}

export function TicketChecklist({ modelName, ticketId, initialChecklistStateJSON }: TicketChecklistProps) {
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
    const [itemStates, setItemStates] = useState<Record<number, ChecklistItemState>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        getChecklistsByKnowledgeBaseId(modelName).then(data => {
            setChecklists(data);
            if (data.length > 0) {
                // Seleccionar el primer checklist por defecto
                setSelectedChecklist(data[0]);
            }
            setIsLoading(false);
        });
    }, [modelName]);

    useEffect(() => {
        try {
            const initialState = initialChecklistStateJSON ? JSON.parse(initialChecklistStateJSON) : {};
            setItemStates(initialState);
        } catch (e) {
            setItemStates({});
        }
    }, [initialChecklistStateJSON]);

    const handleChecklistChange = (checklistId: string) => {
        const checklist = checklists.find(c => c.id === checklistId);
        setSelectedChecklist(checklist || null);
    };

    const updateItemState = (index: number, newState: Partial<ChecklistItemState>) => {
        const currentItemState = itemStates[index] || { status: 'pending', notes: '' };
        const updatedItemState = { ...currentItemState, ...newState };
        
        const newItemStates = { ...itemStates, [index]: updatedItemState };
        setItemStates(newItemStates);

        startTransition(async () => {
            const result = await updateTicketChecklistState(ticketId, JSON.stringify(newItemStates));
            if (!result.success) {
                toast.error("No se pudo guardar el progreso del checklist.");
            }
        });
    };

    const tasks = selectedChecklist?.tasks ? JSON.parse(selectedChecklist.tasks) : [];
    const checklistItems = Array.isArray(tasks) ? tasks : [];

    const getStatusIcon = (status: ChecklistItemState['status']) => {
        switch (status) {
            case 'ok': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'fail': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'na': return <CircleSlash className="h-5 w-5 text-gray-400" />;
            default: return <div className="h-5 w-5" />;
        }
    }

    if (isLoading) {
        return <Card><CardHeader><CardTitle>Cargando Checklists...</CardTitle></CardHeader></Card>
    }
    
    if (checklists.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Checklist de Trabajo</span>
                    {isPending && <Loader className="animate-spin h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>Selecciona una plantilla y completa las tareas.</CardDescription>
                <Select onValueChange={handleChecklistChange} value={selectedChecklist?.id || ""}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar un checklist..." />
                    </SelectTrigger>
                    <SelectContent>
                        {checklists.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            {selectedChecklist && (
                <CardContent className="space-y-4">
                    {checklistItems.map((item: { text: string }, index) => {
                        const state = itemStates[index] || { status: 'pending', notes: '' };
                        return (
                             <div key={index} className="p-3 rounded-md border bg-gray-50/50">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium flex-1">{item.text}</p>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant={state.status === 'ok' ? 'default' : 'outline'} onClick={() => updateItemState(index, { status: 'ok' })}>
                                            <CheckCircle className="h-5 w-5" />
                                        </Button>
                                        <Button size="icon" variant={state.status === 'fail' ? 'destructive' : 'outline'} onClick={() => updateItemState(index, { status: 'fail' })}>
                                            <XCircle className="h-5 w-5" />
                                        </Button>
                                        <Button size="icon" variant={state.status === 'na' ? 'secondary' : 'outline'} onClick={() => updateItemState(index, { status: 'na' })}>
                                            <CircleSlash className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                                {(state.status === 'fail' || state.notes) && (
                                     <Textarea
                                        placeholder="Añadir notas sobre la falla..."
                                        value={state.notes}
                                        onChange={(e) => updateItemState(index, { notes: e.target.value })}
                                        className="mt-2"
                                    />
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            )}
        </Card>
    )
} 