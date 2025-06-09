import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditPartForm } from "./EditPartForm";

export default async function EditPartPage({ params }: { params: { partId: string } }) {
    const { partId } = params;

    const part = await prisma.part.findUnique({
        where: { id: partId },
    });

    if (!part) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl">
                <EditPartForm part={part} />
            </div>
        </div>
    );
} 