'use client'

import { SupplierForm } from '../components/SupplierForm'
import { createSupplier } from '../actions'

const NewSupplierPage = () => {
    
  const handleCreateSupplier = async (data: any) => {
    return await createSupplier(data)
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Crear Nuevo Proveedor
          </h2>
          <p className="text-muted-foreground">
            Añade un nuevo proveedor a tu lista para futuras órdenes de compra.
          </p>
        </div>
      </div>
      <SupplierForm initialData={null} onSubmit={handleCreateSupplier} />
    </div>
  )
}

export default NewSupplierPage