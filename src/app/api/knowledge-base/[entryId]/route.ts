import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { entryId: string } }
) {
    const entryId = params.entryId
    const entry = await prisma.knowledgeBaseEntry.findUnique({
        where: { id: entryId },
        include: {
            checklists: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!entry) {
        return new NextResponse("No se encontró la entrada", { status: 404 })
    }

    return NextResponse.json(entry)
} 