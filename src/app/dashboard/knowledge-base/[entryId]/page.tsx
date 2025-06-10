'use client'

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getKnowledgeBaseEntry, deleteChecklist } from '../actions';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChecklistForm } from './components/ChecklistForm';
import { Checklist, KnowledgeBaseEntry } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type FullEntry = KnowledgeBaseEntry & {
    checklists: Checklist[];
};

export default function KnowledgeBaseEntryPage({ params }: { params: { entryId: string } }) {
    const [entry, setEntry] = useState<FullEntry | null>(null);
    const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const fetchEntry = async () => {
            const result = await getKnowledgeBaseEntry(params.entryId);
            if (result.success && result.data) {
                setEntry(result.data as FullEntry);
            } else {
                notFound();
            }
        };
        fetchEntry();
    }, [params.entryId]);

    const handleFormFinished = async () => {
        const result = await getKnowledgeBaseEntry(params.entryId);
        if (result.success && result.data) {
            setEntry(result.data as FullEntry);
        }
        setEditingChecklist(null);
        setShowCreateForm(false);
    };

    const handleDelete = async (checklistId: string) => {
        const result = await deleteChecklist(checklistId, params.entryId);
        if(result.success) {
            toast.success("Checklist eliminado exitosamente.");
            handleFormFinished(); // Recargar datos
        } else {
            toast.error(result.error);
        }
    }

    if (!entry) {
        return <div>Cargando...</div>;
    }

    // Si estamos editando o creando, mostramos solo el formulario
    if (editingChecklist || showCreateForm) {
        return (
             <div className="flex-1 space-y-4 p-8 pt-6">
                <Button variant="outline" onClick={() => { setEditingChecklist(null); setShowCreateForm(false); }}>
                    &larr; Volver a la lista
                </Button>
                <ChecklistForm 
                    knowledgeBaseEntryId={entry.id}
                    checklist={editingChecklist}
                    onFinished={handleFormFinished}
                />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <Heading
                    title={`Modelo: ${entry.model}`}
                    description="Gestiona las plantillas de checklist para este modelo."
                />
                <Button onClick={() => setShowCreateForm(true)}>
                    Crear Nuevo Checklist
                </Button>
            </div>
            <Separator />
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Checklists Existentes</h2>
                {entry.checklists.length > 0 ? (
                    entry.checklists.map(checklist => (
                        <Card key={checklist.id}>
                            <CardHeader>
                                <CardTitle>{checklist.name}</CardTitle>
                                <CardDescription>
                                    {`Contiene ${JSON.parse(checklist.tasks).length} tareas.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex gap-2">
                                <Button variant="secondary" onClick={() => setEditingChecklist(checklist)}>
                                    Editar
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Eliminar</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente la plantilla de checklist.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(checklist.id)}>Eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p>No hay checklists para este modelo todavía.</p>
                )}
            </div>
        </div>
    );
} 