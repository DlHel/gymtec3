import { getSuppliers } from './actions'
import { SupplierClient } from './components/SupplierClient'

const SuppliersPage = async () => {
  const suppliers = await getSuppliers()

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SupplierClient data={suppliers} />
      </div>
    </div>
  )
}

export default SuppliersPage

