import { SupplierForm } from "../components/SupplierForm";

export default function NewSupplierPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Crear Nuevo Proveedor</h1>
                <p className="text-muted-foreground mt-2">
                    Rellena los datos para registrar un nuevo proveedor.
                </p>
            </div>
            <SupplierForm />
        </div>
    )
} 