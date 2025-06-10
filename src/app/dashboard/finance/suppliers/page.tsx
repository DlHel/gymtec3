import { prisma } from "@/lib/prisma";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SuppliersDataTable } from "./components/SuppliersDataTable";
import { columns } from "./components/columns";
import { PageHeader } from "@/components/modules/PageHeader";

export default async function SuppliersPage() {
    const suppliers = await prisma.supplier.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div>
            <PageHeader title="Proveedores">
                <Button asChild>
                    <Link href="/dashboard/finance/suppliers/new">Crear Proveedor</Link>
                </Button>
            </PageHeader>
            <SuppliersDataTable columns={columns} data={suppliers} />
        </div>
    );
} 

