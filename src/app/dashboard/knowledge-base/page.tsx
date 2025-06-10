import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getKnowledgeBaseEntries } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NewEntryForm } from "./components/NewEntryForm";
import Link from "next/link";

export default async function KnowledgeBasePage() {
    const result = await getKnowledgeBaseEntries();

    if (!result.success) {
        // Manejar el caso de error, quizás mostrar un mensaje
        return <div>Error al cargar la base de conocimiento: {result.error}</div>;
    }
    
    const entries = result.data || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Heading
                title="Base de Conocimiento"
                description="Gestiona las plantillas de checklist para cada modelo de equipo."
            />
            <Separator />
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Añadir Nueva Entrada</h2>
                <NewEntryForm />
            </div>
            <Separator />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {entries.map(entry => (
                    <Link href={`/dashboard/knowledge-base/${entry.id}`} key={entry.id}>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle>{entry.model}</CardTitle>
                                <CardDescription>Gestionar checklists</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
                {entries.length === 0 && (
                    <p className="text-muted-foreground col-span-full">No hay entradas en la base de conocimiento todavía.</p>
                )}
            </div>
        </div>
    );
} 