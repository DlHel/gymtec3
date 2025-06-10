'use client'

import { SupplierForm } from "../../components/SupplierForm"
import { getSupplierById, updateSupplier } from "../../actions"
import { notFound } from "next/navigation"
import { useState, useEffect } from 'react'

interface EditSupplierPageProps {
    params: {
        supplierId: string
    }
}

const EditSupplierPage = ({ params }: EditSupplierPageProps) => {
  const { supplierId } = params;
  const [supplier, setSupplier] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    if (supplierId) {
      const fetchSupplier = async () => {
        const fetchedSupplier = await getSupplierById(supplierId);
        if (!fetchedSupplier) {
          notFound();
        } else {
          setSupplier(fetchedSupplier);
        }
      };
      fetchSupplier();
    }
  }, [supplierId]);

  const handleUpdateSupplier = async (data: any) => {
    return await updateSupplier(supplierId, data)
  };

  if (supplier === undefined) {
    return <div className="flex-col"><div className="flex-1 space-y-4 p-8 pt-6">Cargando proveedor...</div></div>;
  }

  if (!supplier) {
    return <div className="flex-col"><div className="flex-1 space-y-4 p-8 pt-6">Proveedor no encontrado.</div></div>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SupplierForm initialData={supplier} onSubmit={handleUpdateSupplier} />
      </div>
    </div>
  )
}

export default EditSupplierPage