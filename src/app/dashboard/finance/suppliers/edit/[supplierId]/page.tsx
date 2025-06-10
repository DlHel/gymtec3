import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { SupplierForm } from "../../components/SupplierForm";
import { PageHeader } from "@/components/modules/PageHeader";

export default async function EditSupplierPage({ params }: { params: { supplierId: string } }) {
    const supplier = await db.supplier.findUnique({
        where: {
            id: params.supplierId,
        },
    });

    if (!supplier) {
        return notFound();
    }

    return (
        <div>
            <PageHeader title="Editar Proveedor" />
            <div className="p-8">
                <SupplierForm supplier={supplier} />
            </div>
        </div>
    )
} 